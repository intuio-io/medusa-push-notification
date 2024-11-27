import { 
    type SubscriberConfig, 
    type SubscriberArgs,
    OrderService,
  } from "@medusajs/medusa"

export default async function handleOrderShipmentCreated({ 
    data, container 
  }: SubscriberArgs<Record<string, string>>) {
    const pushService = container.resolve("pushNotificationService")
    const orderService: OrderService = container.resolve("orderService")
  
    const order = await orderService.retrieve(data.id, {
      relations: ["customer"],
    })
  
    if (!order.customer_id) return

    let notificationPayload = {
        title: "Order Shipped",
        body: `Order #${order.display_id} is on its way!`,
        data: {
            type: "order.shipped",
            orderId: order.id
        }
    };

    await pushService.sendCustomerNotification(
        order.customer_id,
        notificationPayload
    )

  }
  
  export const config: SubscriberConfig = {
    event: OrderService.Events.SHIPMENT_CREATED,
    context: {
      subscriberId: "order-shipment-created-push-notification-handler",
    },
  }