// src/models/device-subscription.ts
import { BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity, generateEntityId } from "@medusajs/medusa"

@Entity()
export class DeviceSubscription extends BaseEntity {
    @Column()
    device_id: string

    @Column()
    endpoint: string

    @Column()
    p256dh: string

    @Column()
    auth: string

    @Column({ type: "boolean", default: true })
    is_active: boolean

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "dsub")
    }
}