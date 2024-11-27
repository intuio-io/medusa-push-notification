"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/subscribers/sms/return-requested.ts
const medusa_1 = require("@medusajs/medusa");
async function handleReturnRequested({ data, container }) {
    const pushService = container.resolve("pushNotificationService");
    const orderService = container.resolve("orderService");
    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    });
    if (!order.customer_id)
        return;
    let notificationPayload = {
        title: "Return Request Received",
        body: `Return request for order #${order.id} has been received.`,
        data: {
            type: "return.requested",
            orderId: order.id
        }
    };
    await pushService.sendCustomerNotification(order.customer_id, notificationPayload);
}
exports.default = handleReturnRequested;
exports.config = {
    event: medusa_1.OrderService.Events.RETURN_REQUESTED,
    context: {
        subscriberId: "return-requested-push-notification-handler",
    },
};
//# sourceMappingURL=return-requested.js.map