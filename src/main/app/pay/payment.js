"use strict";
/* tslint:disable variable-name allow snake_case */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const class_transformer_1 = require("class-transformer");
class Link {
}
class Links {
}
__decorate([
    class_transformer_1.Type(() => Link)
], Links.prototype, "self", void 0);
__decorate([
    class_transformer_1.Type(() => Link)
], Links.prototype, "next_url", void 0);
class Payment {
    static deserialize(input) {
        return class_transformer_1.plainToClass(Payment, input);
    }
}
__decorate([
    class_transformer_1.Type(() => Links)
], Payment.prototype, "_links", void 0);
exports.Payment = Payment;
