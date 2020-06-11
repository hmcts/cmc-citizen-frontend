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
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.INVALID_NUMBER_OF_CHILDREN = 'Number can’t be higher than on previous page';
class Education {
    constructor(value, maxValue) {
        this.value = value;
        this.maxValue = maxValue;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new Education(numericUtils_1.toNumberOrUndefined(value.value), numericUtils_1.toNumberOrUndefined(value.maxValue));
    }
    deserialize(input) {
        if (input) {
            this.value = input.value;
            this.maxValue = input.maxValue;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.NUMBER_REQUIRED }),
    class_validator_1.IsInt({ message: validationErrors_1.ValidationErrors.INTEGER_REQUIRED }),
    cmc_validators_1.IsLessThanOrEqualTo('maxValue', { message: ValidationErrors.INVALID_NUMBER_OF_CHILDREN }),
    class_validator_1.Min(0, { message: validationErrors_1.ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
], Education.prototype, "value", void 0);
exports.Education = Education;
