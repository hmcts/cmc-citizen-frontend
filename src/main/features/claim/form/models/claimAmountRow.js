"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const numericUtils_1 = require("shared/utils/numericUtils");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'Enter a reason';
ValidationErrors.REASON_TOO_LONG = 'You’ve entered too many characters';
ValidationErrors.AMOUNT_REQUIRED = 'Enter an amount';
ValidationErrors.AMOUNT_NOT_VALID = 'Enter a valid amount';
ValidationErrors.AMOUNT_INVALID_DECIMALS = 'Enter a valid amount, maximum two decimal places';
class ClaimAmountRow {
    constructor(reason, amount) {
        this.reason = reason;
        this.amount = amount;
    }
    static empty() {
        return new ClaimAmountRow(undefined, undefined);
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const reason = value.reason || undefined;
        const amount = numericUtils_1.toNumberOrUndefined(value.amount);
        return new ClaimAmountRow(reason, amount);
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.reason = input.reason;
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.amount !== undefined),
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: ValidationErrors.REASON_TOO_LONG })
], ClaimAmountRow.prototype, "reason", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.reason !== undefined),
    class_validator_1.IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.Min(0.01, { message: ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS })
], ClaimAmountRow.prototype, "amount", void 0);
exports.ClaimAmountRow = ClaimAmountRow;
