"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = void 0;
async function DELETE(req, res) {
    const pushService = req.scope.resolve("pushNotificationService");
    const { device_id } = req.params;
    try {
        await pushService.removeDevice(device_id);
        res.json({
            id: device_id,
            deleted: true
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
exports.DELETE = DELETE;
//# sourceMappingURL=route.js.map