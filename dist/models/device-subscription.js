"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceSubscription = void 0;
// src/models/device-subscription.ts
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
let DeviceSubscription = class DeviceSubscription extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, medusa_1.generateEntityId)(this.id, "dsub");
    }
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceSubscription.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceSubscription.prototype, "endpoint", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceSubscription.prototype, "p256dh", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeviceSubscription.prototype, "auth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: true }),
    __metadata("design:type", Boolean)
], DeviceSubscription.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeviceSubscription.prototype, "beforeInsert", null);
DeviceSubscription = __decorate([
    (0, typeorm_1.Entity)()
], DeviceSubscription);
exports.DeviceSubscription = DeviceSubscription;
//# sourceMappingURL=device-subscription.js.map