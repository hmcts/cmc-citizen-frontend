"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const toBoolean = require("to-boolean");
const isCountrySupported_1 = require("forms/validation/validators/isCountrySupported");
const country_1 = require("common/country");
const cmc_validators_1 = require("@hmcts/cmc-validators");
const validator = new class_validator_1.Validator();
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.FIRST_LINE_REQUIRED = 'Enter first address line';
ValidationErrors.FIRST_LINE_TOO_LONG = 'The address line must be no longer than $constraint1 characters';
ValidationErrors.SECOND_LINE_TOO_LONG = 'The second address line must be no longer than $constraint1 characters';
ValidationErrors.THIRD_LINE_TOO_LONG = 'The third address line must be no longer than $constraint1 characters';
ValidationErrors.CITY_REQUIRED = 'Enter a valid town/city';
ValidationErrors.CITY_NOT_VALID = 'The city must be no longer than $constraint1 characters';
ValidationErrors.POSTCODE_REQUIRED = 'Enter postcode';
ValidationErrors.POSTCODE_NOT_VALID = 'Enter a valid postcode';
ValidationErrors.ADDRESS_DROPDOWN_REQUIRED = 'Select an address';
ValidationErrors.CLAIMANT_COUNTRY_NOT_SUPPORTED = 'The country must be England, Wales, Scotland or Northern Ireland';
ValidationErrors.DEFENDANT_COUNTRY_NOT_SUPPORTED = 'The country must be England or Wales';
class ValidationConstants {
}
exports.ValidationConstants = ValidationConstants;
ValidationConstants.ADDRESS_MAX_LENGTH = 35;
class Address {
    constructor(line1, line2, line3, city, postcode, addressVisible = true, addressSelectorVisible = false, enterManually = false) {
        this.line1 = line1;
        this.line2 = line2;
        this.line3 = line3;
        this.city = city;
        this.postcode = postcode;
        this.addressVisible = addressVisible;
        this.addressSelectorVisible = addressSelectorVisible;
        this.enterManually = enterManually;
    }
    static fromClaimAddress(address) {
        return new Address(address.line1, address.line2, address.line3, address.city, address.postcode);
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        return new Address(input.line1, input.line2, input.line3, input.city, input.postcode);
    }
    deserialize(input) {
        if (input) {
            this.line1 = input.line1;
            this.line2 = input.line2;
            this.line3 = input.line3;
            this.city = input.city;
            this.postcode = input.postcode;
            this.postcodeLookup = input.postcodeLookup;
            this.addressVisible = input.addressVisible ? toBoolean(input.addressVisible) : true;
            this.addressSelectorVisible = input.addressSelectorVisible ? toBoolean(input.addressSelectorVisible) : false;
            this.enterManually = input.enterManually ? toBoolean(input.enterManually) : false;
            this.addressList = input.addressList;
        }
        return this;
    }
    isCompleted(...groups) {
        return validator.validateSync(this, { groups: groups }).length === 0;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.addressVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.FIRST_LINE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, {
        message: ValidationErrors.FIRST_LINE_TOO_LONG,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "line1", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.addressVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, {
        message: ValidationErrors.SECOND_LINE_TOO_LONG,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "line2", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.addressVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, {
        message: ValidationErrors.THIRD_LINE_TOO_LONG,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "line3", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.addressVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.CITY_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.MaxLength(ValidationConstants.ADDRESS_MAX_LENGTH, {
        message: ValidationErrors.CITY_NOT_VALID,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "city", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.addressVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.POSTCODE_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    isCountrySupported_1.IsCountrySupported(country_1.Country.all(), { message: ValidationErrors.CLAIMANT_COUNTRY_NOT_SUPPORTED, groups: ['claimant'] }),
    isCountrySupported_1.IsCountrySupported(country_1.Country.defendantCountries(), {
        message: ValidationErrors.DEFENDANT_COUNTRY_NOT_SUPPORTED,
        groups: ['defendant']
    }),
    cmc_validators_1.IsValidPostcode({
        message: ValidationErrors.POSTCODE_NOT_VALID,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "postcode", void 0);
__decorate([
    class_validator_1.ValidateIf(o => !o.addressVisible && !o.addressSelectorVisible, { groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.ExtraFormFieldsArePopulated(['postcode', 'postcodeLookup'], {
        message: ValidationErrors.POSTCODE_REQUIRED,
        groups: ['claimant', 'defendant', 'response']
    })
], Address.prototype, "postcodeLookup", void 0);
__decorate([
    class_validator_1.ValidateIf(o => !o.addressVisible && o.addressSelectorVisible, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.ADDRESS_DROPDOWN_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.ADDRESS_DROPDOWN_REQUIRED, groups: ['claimant', 'defendant', 'response'] })
], Address.prototype, "addressList", void 0);
exports.Address = Address;
