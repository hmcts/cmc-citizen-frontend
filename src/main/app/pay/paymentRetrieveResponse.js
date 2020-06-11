"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const payment_1 = require("payment-hub-client/payment");
const fee_1 = require("payment-hub-client/fee");
const class_transformer_1 = require("class-transformer");
class PaymentRetrieveResponse extends payment_1.Payment {
}
__decorate([
    class_transformer_1.Expose({ name: 'ccd_case_number' })
], PaymentRetrieveResponse.prototype, "ccdCaseNumber", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'case_reference' })
], PaymentRetrieveResponse.prototype, "caseReference", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'external_provider' })
], PaymentRetrieveResponse.prototype, "externalProvider", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'external_reference' })
], PaymentRetrieveResponse.prototype, "externalReference", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'site_id' })
], PaymentRetrieveResponse.prototype, "siteId", void 0);
__decorate([
    class_transformer_1.Expose({ name: 'service_name' })
], PaymentRetrieveResponse.prototype, "serviceName", void 0);
__decorate([
    class_transformer_1.Type(() => fee_1.Fee)
], PaymentRetrieveResponse.prototype, "fees", void 0);
exports.PaymentRetrieveResponse = PaymentRetrieveResponse;
