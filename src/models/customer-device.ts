import { BeforeInsert, Column, Entity, Index } from "typeorm"
import { BaseEntity, generateEntityId } from "@medusajs/medusa"

export type DeviceInfo = {
    type: "mobile" | "desktop" | "tablet"
    browser: string
    os: string
    model?: string
}

@Entity()
export class CustomerDevice extends BaseEntity {
    @Index()
    @Column({ nullable: true })
    customer_id: string

    @Column()
    device_id: string

    @Column()
    device_name: string

    @Column({ type: "jsonb" })
    device_info: DeviceInfo

    @Column({ type: "timestamp with time zone" })
    last_used: Date

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "cdev")
    }
}