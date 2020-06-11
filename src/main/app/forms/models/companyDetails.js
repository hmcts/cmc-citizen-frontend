"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const partyDetails_1 = require("./partyDetails");
const partyType_1 = require("common/partyType");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG = 'Contact Person name must be no longer than $constraint1 characters';
class ValidationConstraints {
}
exports.ValidationConstraints = ValidationConstraints;
ValidationConstraints.CONTACT_PERSON_MAX_LENGTH = 30;
class CompanyDetails extends partyDetails_1.PartyDetails {
    constructor() {
        super();
        this.type = partyType_1.PartyType.COMPANY.value;
    }
    static fromObject(input) {
        if (input === undefined) {
            return input;
        }
        let deserialized = new CompanyDetails();
        Object.assign(deserialized, partyDetails_1.PartyDetails.fromObject(input));
        deserialized.contactPerson = input.contactPerson;
        deserialized.type = partyType_1.PartyType.COMPANY.value;
        return deserialized;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new partyDetails_1.PartyDetails().deserialize(input));
            this.contactPerson = input.contactPerson;
            this.type = partyType_1.PartyType.COMPANY.value;
        }
        return this;
    }
}
__decorate([
    cmc_validators_1.MaxLength(ValidationConstraints.CONTACT_PERSON_MAX_LENGTH, {
        message: ValidationErrors.CONTACT_PERSON_NAME_TOO_LONG,
        groups: ['claimant', 'defendant', 'response']
    })
], CompanyDetails.prototype, "contactPerson", void 0);
exports.CompanyDetails = CompanyDetails;
