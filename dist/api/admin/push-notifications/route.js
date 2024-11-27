"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
async function POST(req, res) {
    const pushService = req.scope.resolve("pushNotificationService");
    try {
        const { customer_id, notification } = req.body;
        if (!customer_id || !notification) {
            res.status(400).json({
                message: "customer_id and notification are required"
            });
            return;
        }
        const result = await pushService.sendCustomerNotification(customer_id, notification);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
exports.POST = POST;
//# sourceMappingURL=route.js.map