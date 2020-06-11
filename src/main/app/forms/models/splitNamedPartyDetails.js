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
const partyDetails_1 = require("forms/models/partyDetails");
const nameFormatter_1 = require("utils/nameFormatter");
class ValidationErrors {
    static errorTooLong(input) {
        return `${input} must be no longer than $constraint1 characters`;
    }
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.FIRSTNAME_REQUIRED = 'Enter first name';
ValidationErrors.LASTNAME_REQUIRED = 'Enter last name';
class SplitNamedPartyDetails extends partyDetails_1.PartyDetails {
    constructor() {
        super();
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        let deserialized = new SplitNamedPartyDetails();
        Object.assign(deserialized, partyDetails_1.PartyDetails.fromObject(input));
        if (input.title) {
            deserialized.title = input.title;
        }
        deserialized.firstName = input.firstName;
        deserialized.lastName = input.lastName;
        if (deserialized.firstName && deserialized.lastName) {
            deserialized.name = nameFormatter_1.NameFormatter.fullName(input.firstName, input.lastName, input.title);
        }
        else {
            deserialized.name = input.name;
        }
        return deserialized;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new partyDetails_1.PartyDetails().deserialize(input));
            this.title = input.title;
            if (input.firstName && input.lastName) {
                this.firstName = input.firstName;
                this.lastName = input.lastName;
                this.name = nameFormatter_1.NameFormatter.fullName(input.firstName, input.lastName, input.title);
            }
        }
        return this;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => o.title !== undefined, { groups: ['defendant', 'response'] }),
    class_validator_1.MaxLength(35, { message: ValidationErrors.errorTooLong('Title'), groups: ['defendant', 'response'] })
], SplitNamedPartyDetails.prototype, "title", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.firstName !== undefined, { groups: ['response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.FIRSTNAME_REQUIRED, groups: ['defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.FIRSTNAME_REQUIRED, groups: ['defendant', 'response'] }),
    class_validator_1.MaxLength(255, { message: ValidationErrors.errorTooLong('First name'), groups: ['defendant', 'response'] })
], SplitNamedPartyDetails.prototype, "firstName", void 0);
__decorate([
    class_validator_1.ValidateIf(o => o.lastName !== undefined, { groups: ['response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.LASTNAME_REQUIRED, groups: ['defendant', 'response'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.LASTNAME_REQUIRED, groups: ['defendant', 'response'] }),
    class_validator_1.MaxLength(255, { message: ValidationErrors.errorTooLong('Last name'), groups: ['defendant', 'response'] })
], SplitNamedPartyDetails.prototype, "lastName", void 0);
exports.SplitNamedPartyDetails = SplitNamedPartyDetails;
