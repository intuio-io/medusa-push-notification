"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
async function GET(req, res) {
    const pushService = req.scope.resolve("pushNotificationService");
    const { customer_id } = req.query;
    try {
        const result = await pushService.listDevices(customer_id);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
exports.GET = GET;
//# sourceMappingURL=route.js.map