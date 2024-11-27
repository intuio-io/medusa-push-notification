// // src/subscribers/sms/order-placed.ts
import {
    type SubscriberConfig,
    type SubscriberArgs,
    OrderService,
} from "@medusajs/medusa"

export default async function handleOrderPlaced({
    data, container
}: SubscriberArgs<Record<string, string>>) {
    const pushService = container.resolve("pushNotificationService")
    const orderService: OrderService = container.resolve("orderService")

    const order = await orderService.retrieve(data.id, {
        relations: ["customer"],
    })

    if (!order.customer_id) return

    let notificationPayload = {
        title: "Order Confirmed",
        body: `Order #${order.display_id} has been confirmed!`,
        data: {
            type: "order.placed",
            orderId: order.id
        }
    };

    await pushService.sendCustomerNotification(
        order.customer_id,
        notificationPayload
    )
}

export const config: SubscriberConfig = {
    event: OrderService.Events.PLACED,
    context: {
        subscriberId: "order-placed-push-notification-handler",
    },
}