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
const cmc_validators_1 = require("@hmcts/cmc-validators");
const numericUtils_1 = require("shared/utils/numericUtils");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.REASON_REQUIRED = 'You must tell us how you calculated the amount';
class InterestTotal {
    constructor(amount, reason) {
        this.amount = amount;
        this.reason = reason;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new InterestTotal(numericUtils_1.toNumberOrUndefined(value.amount), value.reason);
    }
    deserialize(input) {
        if (input) {
            this.amount = input.amount;
            this.reason = input.reason;
        }
        return this;
    }
    isCompleted() {
        return !!this.amount && !!this.reason;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.Min(0.01, { message: validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], InterestTotal.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.MaxLength(10000, { message: validationErrors_1.ValidationErrors.REASON_TOO_LONG })
], InterestTotal.prototype, "reason", void 0);
exports.InterestTotal = InterestTotal;
