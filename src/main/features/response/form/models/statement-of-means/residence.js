"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.DESCRIBE_YOUR_HOUSING = 'Describe your housing';
class Residence {
    constructor(type, housingDetails) {
        this.type = type;
        this.housingDetails = housingDetails;
    }
    static fromObject(input) {
        if (!input) {
            return input;
        }
        const type = residenceType_1.ResidenceType.valueOf(input.type);
        return new Residence(type, type === residenceType_1.ResidenceType.OTHER ? input.housingDetails : undefined);
    }
    /**
     * Used in the UI
     */
    get residenceType() {
        if (this.type === residenceType_1.ResidenceType.OTHER) {
            return this.housingDetails;
        }
        else {
            return this.type.displayValue;
        }
    }
    deserialize(input) {
        if (input) {
            this.type = input.type ? residenceType_1.ResidenceType.valueOf(input.type.value) : undefined;
            this.housingDetails = input.housingDetails;
        }
        return this;
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION }),
    class_validator_1.IsIn(residenceType_1.ResidenceType.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION })
], Residence.prototype, "type", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.type && o.type.value === residenceType_1.ResidenceType.OTHER.value),
    class_validator_1.IsDefined({ message: ValidationErrors.DESCRIBE_YOUR_HOUSING }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.DESCRIBE_YOUR_HOUSING }),
    class_validator_1.MaxLength(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG })
], Residence.prototype, "housingDetails", void 0);
exports.Residence = Residence;
