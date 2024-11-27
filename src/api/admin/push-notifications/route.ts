// src/api/admin/push-notifications/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pushService = req.scope.resolve("pushNotificationService")

    try {
        const { customer_id, notification }: any = req.body

        if (!customer_id || !notification) {
            res.status(400).json({
                message: "customer_id and notification are required"
            })
            return
        }

        const result = await pushService.sendCustomerNotification(
            customer_id,
            notification
        )

        res.json(result)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}