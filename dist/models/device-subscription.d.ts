import { BaseEntity } from "@medusajs/medusa";
export declare class DeviceSubscription extends BaseEntity {
    device_id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
    is_active: boolean;
    private beforeInsert;
}
