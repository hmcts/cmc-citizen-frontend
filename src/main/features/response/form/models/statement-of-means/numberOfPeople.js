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
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validationConstraints_1 = require("forms/validation/validationConstraints");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.NUMBER_OF_PEOPLE_REQUIRED = 'Enter a number of people you support';
ValidationErrors.DETAILS_REQUIRED = 'Enter details';
class NumberOfPeople {
    constructor(value, details) {
        this.value = value;
        this.details = details;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new NumberOfPeople(numericUtils_1.toNumberOrUndefined(value.value), value.details || undefined);
    }
    deserialize(input) {
        if (input) {
            this.value = input.value;
            this.details = input.details;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.NUMBER_OF_PEOPLE_REQUIRED }),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    class_validator_1.Min(1, { message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], NumberOfPeople.prototype, "value", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.DETAILS_REQUIRED }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.DETAILS_REQUIRED }),
    cmc_validators_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], NumberOfPeople.prototype, "details", void 0);
exports.NumberOfPeople = NumberOfPeople;
