"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const paymentOption_1 = require("main/common/components/payment-intention/model/paymentOption");
const paymentDate_1 = require("main/common/components/payment-intention/model/paymentDate");
const paymentPlan_1 = require("main/common/components/payment-intention/model/paymentPlan");
const domain = require("claims/models/response/core/paymentIntention");
class PaymentIntention {
    static deserialize(input) {
        if (!input) {
            return input;
        }
        const instance = new PaymentIntention();
        if (input.paymentOption) {
            instance.paymentOption = new paymentOption_1.PaymentOption().deserialize(input.paymentOption);
            switch (instance.paymentOption.option) {
                case paymentOption_1.PaymentType.BY_SET_DATE:
                    if (input.paymentDate) {
                        instance.paymentDate = new paymentDate_1.PaymentDate().deserialize(input.paymentDate);
                    }
                    break;
                case paymentOption_1.PaymentType.INSTALMENTS:
                    if (input.paymentPlan) {
                        instance.paymentPlan = new paymentPlan_1.PaymentPlan().deserialize(input.paymentPlan);
                    }
                    break;
            }
        }
        return instance;
    }
    toDomainInstance() {
        const instance = new domain.PaymentIntention();
        instance.paymentOption = this.paymentOption.option.value;
        switch (this.paymentOption.option) {
            case paymentOption_1.PaymentType.BY_SET_DATE:
                instance.paymentDate = this.paymentDate.date.toMoment();
                break;
            case paymentOption_1.PaymentType.INSTALMENTS:
                instance.repaymentPlan = {
                    instalmentAmount: this.paymentPlan.instalmentAmount,
                    paymentSchedule: this.paymentPlan.paymentSchedule.value,
                    firstPaymentDate: this.paymentPlan.firstPaymentDate.toMoment(),
                    completionDate: this.paymentPlan.completionDate.toMoment(),
                    paymentLength: this.paymentPlan.paymentLength
                };
                break;
        }
        return instance;
    }
}
__decorate([
    class_validator_1.IsDefined(),
    class_validator_1.ValidateNested()
], PaymentIntention.prototype, "paymentOption", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.paymentOption.option === paymentOption_1.PaymentType.BY_SET_DATE),
    class_validator_1.IsDefined(),
    class_validator_1.ValidateNested()
], PaymentIntention.prototype, "paymentDate", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.paymentOption.option === paymentOption_1.PaymentType.INSTALMENTS),
    class_validator_1.IsDefined(),
    class_validator_1.ValidateNested()
], PaymentIntention.prototype, "paymentPlan", void 0);
exports.PaymentIntention = PaymentIntention;
