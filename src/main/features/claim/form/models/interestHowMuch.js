"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const numericUtils_1 = require("shared/utils/numericUtils");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TYPE_REQUIRED = 'Choose a type of interest';
class InterestHowMuch {
    constructor(type, dailyAmount) {
        this.type = type;
        this.dailyAmount = dailyAmount;
    }
    static fromObject(value) {
        if (value == null) {
            return value;
        }
        return new InterestHowMuch(value.type, numericUtils_1.toNumberOrUndefined(value.dailyAmount));
    }
    deserialize(input) {
        if (input) {
            this.type = input.type;
            this.dailyAmount = input.dailyAmount;
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
], InterestHowMuch.prototype, "type", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.type === interestRateOption_1.InterestRateOption.DIFFERENT),
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.AMOUNT_REQUIRED }),
    class_validator_1.IsPositive({ message: validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS })
], InterestHowMuch.prototype, "dailyAmount", void 0);
exports.InterestHowMuch = InterestHowMuch;
