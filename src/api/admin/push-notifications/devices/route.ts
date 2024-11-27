import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
): Promise<void> {
    const pushService = req.scope.resolve("pushNotificationService")
    const { customer_id } = req.query

    try {
        const result = await pushService.listDevices(customer_id as string)
        res.json(result)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}