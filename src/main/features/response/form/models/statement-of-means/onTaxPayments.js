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
const toBoolean = require("to-boolean");
const numericUtils_1 = require("shared/utils/numericUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'Enter a reason';
class ValidationConstraints {
}
exports.ValidationConstraints = ValidationConstraints;
ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE = 0.01;
class OnTaxPayments {
    constructor(declared, amountYouOwe, reason) {
        this.declared = declared;
        this.amountYouOwe = amountYouOwe;
        this.reason = reason;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        const declared = value.declared !== undefined ? toBoolean(value.declared) : undefined;
        return new OnTaxPayments(declared, declared ? numericUtils_1.toNumberOrUndefined(value.amountYouOwe) : undefined, declared ? value.reason || undefined : undefined);
    }
    deserialize(input) {
        if (input) {
            this.declared = input.declared;
            if (this.declared) {
                this.amountYouOwe = input.amountYouOwe;
                this.reason = input.reason;
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.YES_NO_REQUIRED })
], OnTaxPayments.prototype, "declared", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.Min(ValidationConstraints.AMOUNT_YOU_OWE_MIN_VALUE, { message: validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED }),
    class_validator_1.Max(validationConstraints_1.ValidationConstraints.MAX_VALUE, { message: validationErrors_1.ValidationErrors.AMOUNT_TOO_HIGH })
], OnTaxPayments.prototype, "amountYouOwe", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.declared === true),
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], OnTaxPayments.prototype, "reason", void 0);
exports.OnTaxPayments = OnTaxPayments;
