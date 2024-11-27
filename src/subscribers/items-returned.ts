import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"

export default async function handleItemsReturned({ 
    data, container 
  }: SubscriberArgs<Record<string, string>>) {
    const pushService = container.resolve("pushNotificationService")
    const orderService: OrderService = container.resolve("orderService")
  
    const order = await orderService.retrieve(data.id, {
      relations: ["customer"],
    })

    if (!order.customer_id) return

    let notificationPayload = {
        title: "Return Received",
        body: `Items for order #${order.display_id} have been received and return is being processed.`,
        data: {
            type: "items.returned",
            orderId: order.id
        }
    };
  
    await pushService.sendCustomerNotification(
        order.customer_id,
        notificationPayload
    )
  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.ITEMS_RETURNED,
    context: {
      subscriberId: "items-returned-push-notification-handler",
    },
  }
  