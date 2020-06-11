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
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.TOO_MANY = 'Enter a number between 0 and $constraint1';
class ValidationConstraints {
}
exports.ValidationConstraints = ValidationConstraints;
ValidationConstraints.MAX_NUMBER_OF_MONTHS = 11;
ValidationConstraints.MAX_NUMBER_OF_YEARS = 80;
class UnemploymentDetails {
    constructor(years, months) {
        this.years = years;
        this.months = months;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new UnemploymentDetails(numericUtils_1.toNumberOrUndefined(value.years), numericUtils_1.toNumberOrUndefined(value.months));
    }
    deserialize(input) {
        if (input) {
            this.months = input.months;
            this.years = input.years;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.NUMBER_REQUIRED }),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED }),
    class_validator_1.Max(ValidationConstraints.MAX_NUMBER_OF_YEARS, { message: ValidationErrors.TOO_MANY })
], UnemploymentDetails.prototype, "years", void 0);
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.NUMBER_REQUIRED }),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED }),
    class_validator_1.Max(ValidationConstraints.MAX_NUMBER_OF_MONTHS, { message: ValidationErrors.TOO_MANY })
], UnemploymentDetails.prototype, "months", void 0);
exports.UnemploymentDetails = UnemploymentDetails;
