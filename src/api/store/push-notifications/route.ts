// src/api/store/push-notifications/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pushService = req.scope.resolve("pushNotificationService")
    // const customerId = req.user?.customer_id // Get logged-in customer ID

    const { customerId } = req.query;

    try {
        // Only return devices for the logged-in customer
        if (!customerId) {
            res.status(401).json({
                message: "Unauthorized"
            })
            return
        }

        const result = await pushService.listDevices(customerId)
        res.json(result)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}


// Register device
export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pushService = req.scope.resolve("pushNotificationService")

    try {
        const { subscription, device_info, customer_id }: any = req.body
        // const customer_id = req.user?.customer_id // Get logged-in customer if any

        if (!subscription || !device_info) {
            res.status(400).json({
                message: "subscription and device_info are required"
            })
            return
        }

        const device = await pushService.registerDevice({
            customer_id,
            device_info,
            subscription
        })

        res.json({
            device_id: device.device_id,
            device_name: device.device_name
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}