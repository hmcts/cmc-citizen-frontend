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
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.JOB_TITLE_REQUIRED = 'Enter a job title';
ValidationErrors.ANNUAL_TURNOVER_REQUIRED = 'Enter an annual turnover';
class SelfEmployment {
    constructor(jobTitle, annualTurnover) {
        this.jobTitle = jobTitle;
        this.annualTurnover = annualTurnover;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new SelfEmployment(value.jobTitle || undefined, numericUtils_1.toNumberOrUndefined(value.annualTurnover));
    }
    deserialize(input) {
        if (input) {
            this.jobTitle = input.jobTitle;
            this.annualTurnover = input.annualTurnover;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.JOB_TITLE_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.JOB_TITLE_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], SelfEmployment.prototype, "jobTitle", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.ANNUAL_TURNOVER_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    cmc_validators_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED }),
    class_validator_1.Max(validationConstraints_1.ValidationConstraints.MAX_VALUE, { message: validationErrors_1.ValidationErrors.AMOUNT_TOO_HIGH })
], SelfEmployment.prototype, "annualTurnover", void 0);
exports.SelfEmployment = SelfEmployment;
