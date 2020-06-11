"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const localDate_1 = require("forms/models/localDate");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const class_validator_1 = require("@hmcts/class-validator");
const dateFutureConstraint_1 = require("forms/validation/validators/dateFutureConstraint");
const validationErrors_1 = require("forms/validation/validationErrors");
const numericUtils_1 = require("shared/utils/numericUtils");
const paymentPlan_1 = require("common/payment-plan/paymentPlan");
const frequency_1 = require("common/frequency/frequency");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.INSTALMENTS_AMOUNT_INVALID = 'Enter a valid amount for equal instalments';
ValidationErrors.FIRST_PAYMENT_DATE_INVALID = 'Enter a valid first payment date';
ValidationErrors.FIRST_PAYMENT_DATE_NOT_IN_FUTURE = 'Enter a first payment date in the future';
ValidationErrors.SCHEDULE_REQUIRED = 'Choose a payment frequency';
class PaymentPlan {
    constructor(totalAmount, instalmentAmount, firstPaymentDate, paymentSchedule) {
        this.totalAmount = totalAmount;
        this.instalmentAmount = instalmentAmount;
        this.firstPaymentDate = firstPaymentDate;
        this.paymentSchedule = paymentSchedule;
        this.completionDate = this.paymentSchedule ? this.getCompletionDate() : undefined;
        this.paymentLength = this.paymentSchedule ? this.getPaymentLength() : undefined;
    }
    static fromObject(value) {
        if (!value) {
            return undefined;
        }
        return new PaymentPlan(numericUtils_1.toNumberOrUndefined(value.totalAmount), numericUtils_1.toNumberOrUndefined(value.instalmentAmount), localDate_1.LocalDate.fromObject(value.firstPaymentDate), value.paymentSchedule ? paymentSchedule_1.PaymentSchedule.of(value.paymentSchedule) : undefined);
    }
    deserialize(input) {
        if (input) {
            this.totalAmount = input.totalAmount;
            this.instalmentAmount = input.instalmentAmount;
            this.firstPaymentDate = new localDate_1.LocalDate().deserialize(input.firstPaymentDate);
            this.paymentSchedule = input.paymentSchedule ? paymentSchedule_1.PaymentSchedule.of(input.paymentSchedule.value) : undefined;
            this.completionDate = new localDate_1.LocalDate().deserialize(input.completionDate);
            this.paymentLength = input.paymentLength;
        }
        return this;
    }
    getCompletionDate() {
        const paymentPlan = paymentPlan_1.PaymentPlan.create(this.totalAmount, this.instalmentAmount, frequency_1.Frequency.of(this.paymentSchedule.value), this.firstPaymentDate.toMoment());
        const lastPaymentDate = paymentPlan.calculateLastPaymentDate();
        return localDate_1.LocalDate.fromMoment(lastPaymentDate);
    }
    getPaymentLength() {
        const paymentPlan = paymentPlan_1.PaymentPlan.create(this.totalAmount, this.instalmentAmount, frequency_1.Frequency.of(this.paymentSchedule.value), this.firstPaymentDate.toMoment());
        return paymentPlan.calculatePaymentLength();
    }
}
__decorate([
    class_validator_1.Min(1.00, {
        message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_LESS_THAN_ONE_POUND,
        groups: ['default', 'claimant-suggestion']
    }),
    cmc_validators_1.IsLessThan('totalAmount', {
        message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID,
        groups: ['default', 'claimant-suggestion']
    }),
    cmc_validators_1.Fractions(0, 2, {
        message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS,
        groups: ['default', 'claimant-suggestion']
    })
], PaymentPlan.prototype, "instalmentAmount", void 0);
__decorate([
    class_validator_1.ValidateNested({ groups: ['default', 'claimant-suggestion'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.FIRST_PAYMENT_DATE_INVALID }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.FIRST_PAYMENT_DATE_INVALID }),
    dateFutureConstraint_1.IsFutureDate({ message: ValidationErrors.FIRST_PAYMENT_DATE_NOT_IN_FUTURE })
], PaymentPlan.prototype, "firstPaymentDate", void 0);
__decorate([
    class_validator_1.IsIn(paymentSchedule_1.PaymentSchedule.all(), { message: ValidationErrors.SCHEDULE_REQUIRED })
], PaymentPlan.prototype, "paymentSchedule", void 0);
exports.PaymentPlan = PaymentPlan;
