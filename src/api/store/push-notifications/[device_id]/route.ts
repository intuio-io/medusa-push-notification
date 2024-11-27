// src/api/store/push-notifications/[device_id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function DELETE(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pushService = req.scope.resolve("pushNotificationService")
    const { device_id } = req.params

    try {
        await pushService.removeDevice(device_id)
        res.json({
            id: device_id,
            deleted: true
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}