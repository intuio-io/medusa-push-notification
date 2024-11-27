"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const medusa_1 = require("@medusajs/medusa");
async function handleOrderShipmentCreated({ data, container }) {
    const pushService = container.resolve("pushNotificationService");
    const orderService = container.resolve("orderService");
    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    });
    if (!order.customer_id)
        return;
    let notificationPayload = {
        title: "Order Shipped",
        body: `Order #${order.display_id} is on its way!`,
        data: {
            type: "order.shipped",
            orderId: order.id
        }
    };
    await pushService.sendCustomerNotification(order.customer_id, notificationPayload);
}
exports.default = handleOrderShipmentCreated;
exports.config = {
    event: medusa_1.OrderService.Events.SHIPMENT_CREATED,
    context: {
        subscriberId: "order-shipment-created-push-notification-handler",
    },
};
//# sourceMappingURL=order-shipment-created.js.map