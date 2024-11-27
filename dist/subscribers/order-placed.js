"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// // src/subscribers/sms/order-placed.ts
const medusa_1 = require("@medusajs/medusa");
async function handleOrderPlaced({ data, container }) {
    const pushService = container.resolve("pushNotificationService");
    const orderService = container.resolve("orderService");
    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    });
    if (!order.customer_id)
        return;
    let notificationPayload = {
        title: "Order Confirmed",
        body: `Order #${order.display_id} has been confirmed!`,
        data: {
            type: "order.placed",
            orderId: order.id
        }
    };
    await pushService.sendCustomerNotification(order.customer_id, notificationPayload);
}
exports.default = handleOrderPlaced;
exports.config = {
    event: medusa_1.OrderService.Events.PLACED,
    context: {
        subscriberId: "order-placed-push-notification-handler",
    },
};
//# sourceMappingURL=order-placed.js.map