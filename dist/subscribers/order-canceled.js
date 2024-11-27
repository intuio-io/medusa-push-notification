"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const medusa_1 = require("@medusajs/medusa");
async function handleOrderCanceled({ data, container }) {
    const pushService = container.resolve("pushNotificationService");
    const orderService = container.resolve("orderService");
    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    });
    if (!order.customer_id)
        return;
    let notificationPayload = {
        title: "Order Canceled!",
        body: `Order #${data.id} has been canceled.`,
        data: {
            type: "order.canceled",
            orderId: order.id
        }
    };
    await pushService.sendCustomerNotification(order.customer_id, notificationPayload);
}
exports.default = handleOrderCanceled;
exports.config = {
    event: medusa_1.OrderService.Events.CANCELED,
    context: {
        subscriberId: "order-canceled-push-notification-handler",
    },
};
//# sourceMappingURL=order-canceled.js.map