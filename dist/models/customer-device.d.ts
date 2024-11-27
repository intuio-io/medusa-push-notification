import { BaseEntity } from "@medusajs/medusa";
export type DeviceInfo = {
    type: "mobile" | "desktop" | "tablet";
    browser: string;
    os: string;
    model?: string;
};
export declare class CustomerDevice extends BaseEntity {
    customer_id: string;
    device_id: string;
    device_name: string;
    device_info: DeviceInfo;
    last_used: Date;
    private beforeInsert;
}
