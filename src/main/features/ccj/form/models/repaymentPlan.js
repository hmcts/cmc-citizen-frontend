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
const class_validator_1 = require("@hmcts/class-validator");
const dateFutureConstraint_1 = require("forms/validation/validators/dateFutureConstraint");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationErrors_1 = require("forms/validation/validationErrors");
const numericUtils_1 = require("shared/utils/numericUtils");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.INSTALMENTS_AMOUNT_INVALID = 'Enter a valid payment amount';
ValidationErrors.INVALID_DATE = 'Enter a valid first payment date';
ValidationErrors.FUTURE_DATE = 'Enter a first payment date in the future';
ValidationErrors.SELECT_PAYMENT_SCHEDULE = 'Select how often they should pay';
class RepaymentPlan {
    constructor(remainingAmount, instalmentAmount, firstPaymentDate, paymentSchedule) {
        this.remainingAmount = remainingAmount;
        this.instalmentAmount = instalmentAmount;
        this.firstPaymentDate = firstPaymentDate;
        this.paymentSchedule = paymentSchedule;
    }
    static fromObject(value) {
        if (value) {
            const remainingAmount = numericUtils_1.toNumberOrUndefined(value.remainingAmount);
            const instalmentAmount = numericUtils_1.toNumberOrUndefined(value.instalmentAmount);
            const firstPaymentDate = localDate_1.LocalDate.fromObject(value.firstPaymentDate);
            const paymentSchedule = paymentSchedule_1.PaymentSchedule.all()
                .filter(option => option.value === value.paymentSchedule)
                .pop();
            return new RepaymentPlan(remainingAmount, instalmentAmount, firstPaymentDate, paymentSchedule);
        }
        else {
            return new RepaymentPlan();
        }
    }
    deserialize(input) {
        if (input) {
            this.remainingAmount = input.remainingAmount;
            this.instalmentAmount = input.instalmentAmount;
            this.firstPaymentDate = new localDate_1.LocalDate().deserialize(input.firstPaymentDate);
            this.paymentSchedule = paymentSchedule_1.PaymentSchedule.all()
                .filter(option => input.paymentSchedule && option.value === input.paymentSchedule.value)
                .pop();
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsPositive({ message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID }),
    cmc_validators_1.IsLessThan('remainingAmount', { message: ValidationErrors.INSTALMENTS_AMOUNT_INVALID }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], RepaymentPlan.prototype, "instalmentAmount", void 0);
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsDefined({ message: ValidationErrors.INVALID_DATE }),
    cmc_validators_1.IsValidLocalDate({ message: ValidationErrors.INVALID_DATE }),
    dateFutureConstraint_1.IsFutureDate({ message: ValidationErrors.FUTURE_DATE })
], RepaymentPlan.prototype, "firstPaymentDate", void 0);
__decorate([
    class_validator_1.IsIn(paymentSchedule_1.PaymentSchedule.all(), { message: ValidationErrors.SELECT_PAYMENT_SCHEDULE })
], RepaymentPlan.prototype, "paymentSchedule", void 0);
exports.RepaymentPlan = RepaymentPlan;
