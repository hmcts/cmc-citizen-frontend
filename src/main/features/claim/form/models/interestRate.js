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
const numericUtils_1 = require("shared/utils/numericUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const interestUtils_1 = require("shared/interestUtils");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_REQUIRED = 'Choose a rate of interest';
ValidationErrors.RATE_REQUIRED = 'You haven’t entered a rate';
ValidationErrors.RATE_NOT_VALID = 'Correct the rate you’ve entered';
ValidationErrors.REASON_REQUIRED = 'You haven’t explained why you’re claiming this rate';
class InterestRate {
    constructor(type, rate, reason) {
        this.type = type;
        this.rate = rate;
        this.reason = reason;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        const instance = new InterestRate(value.type, numericUtils_1.toNumberOrUndefined(value.rate), value.reason);
        switch (instance.type) {
            case interestRateOption_1.InterestRateOption.STANDARD:
                instance.rate = interestUtils_1.getStandardInterestRate();
                instance.reason = undefined;
                break;
        }
        return instance;
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            this.rate = input.rate;
            this.reason = input.reason;
        }
        return this;
    }
    isCompleted() {
        return !!this.type && (this.type === interestRateOption_1.InterestRateOption.STANDARD || this.type === interestRateOption_1.InterestRateOption.DIFFERENT);
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.TYPE_REQUIRED }),
    class_validator_1.IsIn(interestRateOption_1.InterestRateOption.all(), { message: ValidationErrors.TYPE_REQUIRED })
], InterestRate.prototype, "type", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.type === interestRateOption_1.InterestRateOption.DIFFERENT),
    class_validator_1.IsDefined({ message: ValidationErrors.RATE_REQUIRED }),
    class_validator_1.IsPositive({ message: ValidationErrors.RATE_NOT_VALID })
], InterestRate.prototype, "rate", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.type === interestRateOption_1.InterestRateOption.DIFFERENT),
    class_validator_1.IsDefined({ message: ValidationErrors.REASON_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.REASON_REQUIRED }),
    class_validator_1.MaxLength(250, { message: validationErrors_1.ValidationErrors.REASON_TOO_LONG })
], InterestRate.prototype, "reason", void 0);
exports.InterestRate = InterestRate;
