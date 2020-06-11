"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const address_1 = require("forms/models/address");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.FIRST_LINE_REQUIRED = 'Enter first correspondence address line';
ValidationErrors.FIRST_LINE_TOO_LONG = 'The correspondence address line must be no longer than $constraint1 characters';
ValidationErrors.SECOND_LINE_TOO_LONG = 'The second correspondence address line must be no longer than $constraint1 characters';
ValidationErrors.THIRD_LINE_TOO_LONG = 'The third correspondence address line must be no longer than $constraint1 characters';
ValidationErrors.CITY_REQUIRED = 'Enter correspondence town/city';
ValidationErrors.CITY_NOT_VALID = 'The correspondence address city must be no longer than $constraint1 characters';
ValidationErrors.POSTCODE_REQUIRED = 'Enter correspondence address postcode';
ValidationErrors.POSTCODE_NOT_VALID = 'The correspondence address postcode is not valid';
class ValidationConstants {
}
exports.ValidationConstants = ValidationConstants;
ValidationConstants.ADDRESS_MAX_LENGTH = 100;
class CorrespondenceAddress extends address_1.Address {
}
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.FIRST_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
], CorrespondenceAddress.prototype, "line1", void 0);
__decorate([
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.SECOND_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
], CorrespondenceAddress.prototype, "line2", void 0);
__decorate([
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.THIRD_LINE_TOO_LONG, groups: ['claimant', 'defendant', 'response'] })
], CorrespondenceAddress.prototype, "line3", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, { message: ValidationErrors.CITY_NOT_VALID, groups: ['claimant', 'defendant', 'response'] })
], CorrespondenceAddress.prototype, "city", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsValidPostcode({
        message: ValidationErrors.POSTCODE_NOT_VALID,
        groups: ['claimant', 'defendant', 'response']
    })
], CorrespondenceAddress.prototype, "postcode", void 0);
exports.CorrespondenceAddress = CorrespondenceAddress;
