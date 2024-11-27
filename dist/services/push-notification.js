"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/push-notification.ts
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/utils");
const customer_device_1 = require("../models/customer-device");
const device_subscription_1 = require("../models/device-subscription");
const web_push_1 = __importDefault(require("web-push"));
class PushNotificationService extends medusa_1.TransactionBaseService {
    constructor(container) {
        super(container);
        // Initialize web-push with VAPID keys
        web_push_1.default.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:your-email@example.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    }
    async listDevices(customerId) {
        return await this.atomicPhase_(async (manager) => {
            const deviceRepo = manager.getRepository(customer_device_1.CustomerDevice);
            const subscriptionRepo = manager.getRepository(device_subscription_1.DeviceSubscription);
            // Build query based on customer ID
            const where = {};
            if (customerId) {
                where.customer_id = customerId;
            }
            // Get all devices
            const devices = await deviceRepo.find({
                where,
                order: {
                    last_used: 'DESC'
                }
            });
            // Get subscription status for each device
            const devicesWithStatus = await Promise.all(devices.map(async (device) => {
                const subscription = await subscriptionRepo.findOne({
                    where: {
                        device_id: device.device_id,
                        is_active: true
                    }
                });
                return {
                    device_id: device.device_id,
                    device_name: device.device_name,
                    device_info: device.device_info,
                    is_active: !!subscription,
                    last_used: device.last_used
                };
            }));
            return { devices: devicesWithStatus };
        });
    }
    /**
     * Register a new device subscription
     */
    async registerDevice(data) {
        return await this.atomicPhase_(async (manager) => {
            const deviceRepo = manager.getRepository(customer_device_1.CustomerDevice);
            const subscriptionRepo = manager.getRepository(device_subscription_1.DeviceSubscription);
            // Generate device ID and name
            const deviceId = this.generateDeviceId(data.device_info);
            const deviceName = this.generateDeviceName(data.device_info);
            // Find or create device
            let device = await deviceRepo.findOne({
                where: {
                    device_id: deviceId,
                    customer_id: data.customer_id || null
                }
            });
            if (!device) {
                device = deviceRepo.create({
                    customer_id: data.customer_id,
                    device_id: deviceId,
                    device_name: deviceName,
                    device_info: data.device_info,
                    last_used: new Date()
                });
            }
            else {
                device.last_used = new Date();
            }
            await deviceRepo.save(device);
            // Create or update subscription
            let subscription = await subscriptionRepo.findOne({
                where: { device_id: deviceId }
            });
            const subscriptionData = {
                device_id: deviceId,
                endpoint: data.subscription.endpoint,
                p256dh: data.subscription.keys.p256dh,
                auth: data.subscription.keys.auth,
                is_active: true
            };
            if (subscription) {
                Object.assign(subscription, subscriptionData);
            }
            else {
                subscription = subscriptionRepo.create(subscriptionData);
            }
            await subscriptionRepo.save(subscription);
            return device;
        });
    }
    /**
     * Send notification to specific device
     */
    async sendNotification(device_id, payload) {
        return await this.atomicPhase_(async (manager) => {
            const subscriptionRepo = manager.getRepository(device_subscription_1.DeviceSubscription);
            const subscription = await subscriptionRepo.findOne({
                where: {
                    device_id,
                    is_active: true
                }
            });
            if (!subscription) {
                throw new utils_1.MedusaError(utils_1.MedusaError.Types.NOT_FOUND, `No active subscription found for device ${device_id}`);
            }
            try {
                await web_push_1.default.sendNotification({
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                }, JSON.stringify(payload));
                // Update last_used timestamp
                await manager.getRepository(customer_device_1.CustomerDevice).update({ device_id }, { last_used: new Date() });
            }
            catch (error) {
                if (error.statusCode === 404 || error.statusCode === 410) {
                    // Subscription is no longer valid
                    await subscriptionRepo.update({ device_id }, { is_active: false });
                }
                throw error;
            }
        });
    }
    /**
     * Send notification to all customer devices
     */
    async sendCustomerNotification(customer_id, payload) {
        const deviceRepo = this.manager_.getRepository(customer_device_1.CustomerDevice);
        const devices = await deviceRepo.find({
            where: { customer_id }
        });
        let sent = 0;
        let failed = 0;
        for (const device of devices) {
            try {
                await this.sendNotification(device.device_id, payload);
                sent++;
            }
            catch (error) {
                failed++;
                console.error(`Failed to send to device ${device.id}:`, error);
            }
        }
        return { sent, failed };
    }
    /**
     * Remove device subscription
     */
    async removeDevice(device_id) {
        return await this.atomicPhase_(async (manager) => {
            await manager.getRepository(device_subscription_1.DeviceSubscription).delete({ device_id });
            await manager.getRepository(customer_device_1.CustomerDevice).delete({ device_id });
        });
    }
    generateDeviceId(deviceInfo) {
        const uniqueAttributes = [
            deviceInfo.type,
            deviceInfo.os,
            deviceInfo.browser,
            deviceInfo.model
        ].filter(Boolean);
        return Buffer.from(uniqueAttributes.join('-')).toString('base64');
    }
    generateDeviceName(deviceInfo) {
        return `${deviceInfo.model || deviceInfo.browser} ${deviceInfo.type}`;
    }
}
exports.default = PushNotificationService;
//# sourceMappingURL=push-notification.js.map