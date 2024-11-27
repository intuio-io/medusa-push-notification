import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"

export default async function handleOrderCanceled({ 
    data, container 
  }: SubscriberArgs<Record<string, string>>) {
    const pushService = container.resolve("pushNotificationService")
    const orderService: OrderService = container.resolve("orderService")
  
    const order = await orderService.retrieve(data.id, {
      relations: ["customer"],
    })

    if (!order.customer_id) return

    let notificationPayload = {
        title: "Order Canceled!",
        body: `Order #${data.id} has been canceled.`,
        data: {
            type: "order.canceled",
            orderId: order.id
        }
    };
  
    await pushService.sendCustomerNotification(
        order.customer_id,
        notificationPayload
    )

  }

  export const config: SubscriberConfig = {
    event: OrderService.Events.CANCELED,
    context: {
      subscriberId: "order-canceled-push-notification-handler",
    },
  }