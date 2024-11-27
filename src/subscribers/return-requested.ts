// src/subscribers/sms/return-requested.ts
import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"

export default async function handleReturnRequested({ 
    data, container 
  }: SubscriberArgs<Record<string, string>>) {
    const pushService = container.resolve("pushNotificationService")
    const orderService: OrderService = container.resolve("orderService")
  
    const order = await orderService.retrieve(data.id, {
      relations: ["customer"],
    })

    if (!order.customer_id) return

    let notificationPayload = {
        title: "Return Request Received",
        body: `Return request for order #${order.id} has been received.`,
        data: {
            type: "return.requested",
            orderId: order.id
        }
    };
  
    await pushService.sendCustomerNotification(
        order.customer_id,
        notificationPayload
    )
  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.RETURN_REQUESTED,
    context: {
      subscriberId: "return-requested-push-notification-handler",
    },
  }