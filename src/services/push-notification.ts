// src/services/push-notification.ts
import { TransactionBaseService } from "@medusajs/medusa"
import { MedusaError } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { CustomerDevice, DeviceInfo } from "../models/customer-device"
import { DeviceSubscription } from "../models/device-subscription"
import webpush from "web-push"

type CreateSubscriptionInput = {
    customer_id?: string
    device_info: DeviceInfo
    subscription: {
        endpoint: string
        keys: {
            p256dh: string
            auth: string
        }
    }
}

type PushNotificationPayload = {
    title: string
    body: string
    icon?: string
    badge?: string
    data?: any
}

class PushNotificationService extends TransactionBaseService {
    protected readonly manager_: EntityManager

    constructor(container) {
        super(container)

        // Initialize web-push with VAPID keys
        webpush.setVapidDetails(
            process.env.VAPID_SUBJECT || 'mailto:your-email@example.com',
            process.env.VAPID_PUBLIC_KEY,
            process.env.VAPID_PRIVATE_KEY
        )
    }


    async listDevices(customerId?: string): Promise<{
        devices: Array<{
            device_id: string
            device_name: string
            device_info: any
            is_active: boolean
            last_used: Date
        }>
    }> {
        return await this.atomicPhase_(async (manager) => {
            const deviceRepo = manager.getRepository(CustomerDevice)
            const subscriptionRepo = manager.getRepository(DeviceSubscription)

            // Build query based on customer ID
            const where: any = {}
            if (customerId) {
                where.customer_id = customerId
            }

            // Get all devices
            const devices = await deviceRepo.find({
                where,
                order: {
                    last_used: 'DESC'
                }
            })

            // Get subscription status for each device
            const devicesWithStatus = await Promise.all(
                devices.map(async (device) => {
                    const subscription = await subscriptionRepo.findOne({
                        where: {
                            device_id: device.device_id,
                            is_active: true
                        }
                    })

                    return {
                        device_id: device.device_id,
                        device_name: device.device_name,
                        device_info: device.device_info,
                        is_active: !!subscription,
                        last_used: device.last_used
                    }
                })
            )

            return { devices: devicesWithStatus }
        })
    }

    /**
     * Register a new device subscription
     */
    async registerDevice(data: CreateSubscriptionInput): Promise<CustomerDevice> {
        return await this.atomicPhase_(async (manager) => {
            const deviceRepo = manager.getRepository(CustomerDevice)
            const subscriptionRepo = manager.getRepository(DeviceSubscription)

            // Generate device ID and name
            const deviceId = this.generateDeviceId(data.device_info)
            const deviceName = this.generateDeviceName(data.device_info)

            // Find or create device
            let device = await deviceRepo.findOne({
                where: {
                    device_id: deviceId,
                    customer_id: data.customer_id || null
                }
            })

            if (!device) {
                device = deviceRepo.create({
                    customer_id: data.customer_id,
                    device_id: deviceId,
                    device_name: deviceName,
                    device_info: data.device_info,
                    last_used: new Date()
                })
            } else {
                device.last_used = new Date()
            }

            await deviceRepo.save(device)

            // Create or update subscription
            let subscription = await subscriptionRepo.findOne({
                where: { device_id: deviceId }
            })

            const subscriptionData = {
                device_id: deviceId,
                endpoint: data.subscription.endpoint,
                p256dh: data.subscription.keys.p256dh,
                auth: data.subscription.keys.auth,
                is_active: true
            }

            if (subscription) {
                Object.assign(subscription, subscriptionData)
            } else {
                subscription = subscriptionRepo.create(subscriptionData)
            }

            await subscriptionRepo.save(subscription)

            return device
        })
    }

    /**
     * Send notification to specific device
     */
    async sendNotification(
        device_id: string,
        payload: PushNotificationPayload
    ): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const subscriptionRepo = manager.getRepository(DeviceSubscription)

            const subscription = await subscriptionRepo.findOne({
                where: {
                    device_id,
                    is_active: true
                }
            })

            if (!subscription) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `No active subscription found for device ${device_id}`
                )
            }

            try {
                await webpush.sendNotification(
                    {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.p256dh,
                            auth: subscription.auth
                        }
                    },
                    JSON.stringify(payload)
                )

                // Update last_used timestamp
                await manager.getRepository(CustomerDevice).update(
                    { device_id },
                    { last_used: new Date() }
                )
            } catch (error) {
                if (error.statusCode === 404 || error.statusCode === 410) {
                    // Subscription is no longer valid
                    await subscriptionRepo.update(
                        { device_id },
                        { is_active: false }
                    )
                }
                throw error
            }
        })
    }

    /**
     * Send notification to all customer devices
     */
    async sendCustomerNotification(
        customer_id: string,
        payload: PushNotificationPayload
    ): Promise<{ sent: number; failed: number }> {
        const deviceRepo = this.manager_.getRepository(CustomerDevice)

        const devices = await deviceRepo.find({
            where: { customer_id }
        })

        let sent = 0
        let failed = 0

        for (const device of devices) {
            try {
                await this.sendNotification(device.device_id, payload)
                sent++
            } catch (error) {
                failed++
                console.error(`Failed to send to device ${device.id}:`, error)
            }
        }

        return { sent, failed }
    }

    /**
     * Remove device subscription
     */
    async removeDevice(device_id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            await manager.getRepository(DeviceSubscription).delete({ device_id })
            await manager.getRepository(CustomerDevice).delete({ device_id })
        })
    }

    private generateDeviceId(deviceInfo: DeviceInfo): string {
        const uniqueAttributes = [
            deviceInfo.type,
            deviceInfo.os,
            deviceInfo.browser,
            deviceInfo.model
        ].filter(Boolean)

        return Buffer.from(uniqueAttributes.join('-')).toString('base64')
    }

    private generateDeviceName(deviceInfo: DeviceInfo): string {
        return `${deviceInfo.model || deviceInfo.browser} ${deviceInfo.type}`
    }
}

export default PushNotificationService