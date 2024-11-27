"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const medusa_1 = require("@medusajs/medusa");
async function handleItemsReturned({ data, container }) {
    const pushService = container.resolve("pushNotificationService");
    const orderService = container.resolve("orderService");
    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    });
    if (!order.customer_id)
        return;
    let notificationPayload = {
        title: "Return Received",
        body: `Items for order #${order.display_id} have been received and return is being processed.`,
        data: {
            type: "items.returned",
            orderId: order.id
        }
    };
    await pushService.sendCustomerNotification(order.customer_id, notificationPayload);
}
exports.default = handleItemsReturned;
exports.config = {
    event: medusa_1.OrderService.Events.ITEMS_RETURNED,
    context: {
        subscriberId: "items-returned-push-notification-handler",
    },
};
//# sourceMappingURL=items-returned.js.map