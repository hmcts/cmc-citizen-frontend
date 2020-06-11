"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const multiRowFormItem_1 = require("forms/models/multiRowFormItem");
const numericUtils_1 = require("shared/utils/numericUtils");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DEBT_REQUIRED = 'Enter a debt';
ValidationErrors.TOTAL_OWED_REQUIRED = 'Enter the total owed';
ValidationErrors.MONTHLY_PAYMENT_REQUIRED = 'Enter a monthly payment';
class DebtRow extends multiRowFormItem_1.MultiRowFormItem {
    constructor(debt, totalOwed, monthlyPayment) {
        super();
        this.debt = debt;
        this.totalOwed = totalOwed;
        this.monthlyPayments = monthlyPayment;
    }
    static empty() {
        return new DebtRow(undefined, undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const debt = value.debt || undefined;
        const totalOwed = numericUtils_1.toNumberOrUndefined(value.totalOwed);
        const monthlyPayments = numericUtils_1.toNumberOrUndefined(value.monthlyPayments);
        return new DebtRow(debt, totalOwed, monthlyPayments);
    }
    deserialize(input) {
        if (input) {
            this.debt = input.debt;
            this.totalOwed = input.totalOwed;
            this.monthlyPayments = input.monthlyPayments;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.DEBT_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.DEBT_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], DebtRow.prototype, "debt", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.TOTAL_OWED_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(0.01, { message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], DebtRow.prototype, "totalOwed", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.isAtLeastOneFieldPopulated()),
    class_validator_1.IsDefined({ message: ValidationErrors.MONTHLY_PAYMENT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], DebtRow.prototype, "monthlyPayments", void 0);
exports.DebtRow = DebtRow;
