"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePushSubscriptionTable1730792039608 = void 0;
// src/migrations/[timestamp]-create-push-notification-tables.ts
const typeorm_1 = require("typeorm");
class CreatePushSubscriptionTable1730792039608 {
    async up(queryRunner) {
        // Customer Devices Table
        await queryRunner.createTable(new typeorm_1.Table({
            name: "customer_device",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "customer_id",
                    type: "varchar",
                    isNullable: true
                },
                {
                    name: "device_id",
                    type: "varchar"
                },
                {
                    name: "device_name",
                    type: "varchar"
                },
                {
                    name: "device_info",
                    type: "jsonb"
                },
                {
                    name: "last_used",
                    type: "timestamp with time zone",
                    default: "now()"
                },
                {
                    name: "created_at",
                    type: "timestamp with time zone",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp with time zone",
                    default: "now()"
                }
            ]
        }));
        // Device Subscriptions Table
        await queryRunner.createTable(new typeorm_1.Table({
            name: "device_subscription",
            columns: [
                {
                    name: "id",
                    type: "varchar",
                    isPrimary: true
                },
                {
                    name: "device_id",
                    type: "varchar"
                },
                {
                    name: "endpoint",
                    type: "varchar"
                },
                {
                    name: "p256dh",
                    type: "varchar"
                },
                {
                    name: "auth",
                    type: "varchar"
                },
                {
                    name: "is_active",
                    type: "boolean",
                    default: true
                },
                {
                    name: "created_at",
                    type: "timestamp with time zone",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp with time zone",
                    default: "now()"
                }
            ]
        }));
        // Add foreign keys
        await queryRunner.createForeignKey("customer_device", new typeorm_1.TableForeignKey({
            columnNames: ["customer_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "customer",
            onDelete: "CASCADE"
        }));
        // Create indexes
        await queryRunner.createIndex("customer_device", {
            name: "IDX_customer_device_customer",
            columnNames: ["customer_id"],
            "@instanceof": undefined,
            isUnique: false,
            isSpatial: false,
            isConcurrent: false,
            isFulltext: false,
            isNullFiltered: false,
            where: "",
            clone: function () {
                throw new Error("Function not implemented.");
            }
        });
        await queryRunner.createIndex("customer_device", {
            name: "IDX_customer_device_device",
            columnNames: ["device_id"],
            "@instanceof": undefined,
            isUnique: false,
            isSpatial: false,
            isConcurrent: false,
            isFulltext: false,
            isNullFiltered: false,
            where: "",
            clone: function () {
                throw new Error("Function not implemented.");
            }
        });
        await queryRunner.createIndex("device_subscription", {
            name: "IDX_device_subscription_device",
            columnNames: ["device_id"],
            "@instanceof": undefined,
            isUnique: false,
            isSpatial: false,
            isConcurrent: false,
            isFulltext: false,
            isNullFiltered: false,
            where: "",
            clone: function () {
                throw new Error("Function not implemented.");
            }
        });
    }
    async down(queryRunner) {
        await queryRunner.dropTable("device_subscription", true);
        await queryRunner.dropTable("customer_device", true);
    }
}
exports.CreatePushSubscriptionTable1730792039608 = CreatePushSubscriptionTable1730792039608;
//# sourceMappingURL=1730792039608-CreatePushSubscriptionTable.js.map