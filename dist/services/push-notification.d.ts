import { TransactionBaseService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { CustomerDevice, DeviceInfo } from "../models/customer-device";
type CreateSubscriptionInput = {
    customer_id?: string;
    device_info: DeviceInfo;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
};
type PushNotificationPayload = {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
};
declare class PushNotificationService extends TransactionBaseService {
    protected readonly manager_: EntityManager;
    constructor(container: any);
    listDevices(customerId?: string): Promise<{
        devices: Array<{
            device_id: string;
            device_name: string;
            device_info: any;
            is_active: boolean;
            last_used: Date;
        }>;
    }>;
    /**
     * Register a new device subscription
     */
    registerDevice(data: CreateSubscriptionInput): Promise<CustomerDevice>;
    /**
     * Send notification to specific device
     */
    sendNotification(device_id: string, payload: PushNotificationPayload): Promise<void>;
    /**
     * Send notification to all customer devices
     */
    sendCustomerNotification(customer_id: string, payload: PushNotificationPayload): Promise<{
        sent: number;
        failed: number;
    }>;
    /**
     * Remove device subscription
     */
    removeDevice(device_id: string): Promise<void>;
    private generateDeviceId;
    private generateDeviceName;
}
export default PushNotificationService;
