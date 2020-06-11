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
const address_1 = require("forms/models/address");
const correspondenceAddress_1 = require("forms/models/correspondenceAddress");
const partyType_1 = require("common/partyType");
const validationErrors_1 = require("forms/validation/validationErrors");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ADDRESS_REQUIRED = 'Enter an address';
ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED = 'Enter a correspondence address';
ValidationErrors.NAME_REQUIRED = 'Enter name';
ValidationErrors.NAME_TOO_LONG = 'Name must be no longer than $constraint1 characters';
ValidationErrors.PHONE_REQUIRED = 'You can only change your phone number, not remove it';
class PartyDetails {
    constructor(name, address = new address_1.Address(), hasCorrespondenceAddress = false, correspondenceAddress = new correspondenceAddress_1.CorrespondenceAddress(), phone) {
        this.address = address;
        this.hasCorrespondenceAddress = hasCorrespondenceAddress;
        this.correspondenceAddress = correspondenceAddress;
        this.name = name;
        this.phone = phone;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        const deserialized = new PartyDetails(input.name, new address_1.Address().deserialize(input.address), input.hasCorrespondenceAddress === 'true', new correspondenceAddress_1.CorrespondenceAddress().deserialize(input.correspondenceAddress));
        if (deserialized.hasCorrespondenceAddress === false) {
            deserialized.correspondenceAddress = undefined;
        }
        deserialized.type = input.type;
        if (input.phone !== undefined) {
            deserialized.phone = input.phone;
        }
        return deserialized;
    }
    deserialize(input) {
        if (input) {
            this.address = new address_1.Address().deserialize(input.address);
            this.type = input.type;
            this.name = input.name;
            this.address = new address_1.Address().deserialize(input.address);
            this.hasCorrespondenceAddress = input.hasCorrespondenceAddress;
            this.correspondenceAddress = new correspondenceAddress_1.CorrespondenceAddress().deserialize(input.correspondenceAddress);
            if (input.phone !== undefined) {
                this.phone = input.phone;
            }
        }
        return this;
    }
    isCompleted(...groups) {
        return new class_validator_1.Validator().validateSync(this, { groups: groups }).length === 0;
    }
    isBusiness() {
        return this.type === partyType_1.PartyType.COMPANY.value || this.type === partyType_1.PartyType.ORGANISATION.value;
    }
}
__decorate([
    class_validator_1.ValidateIf(o => (o.lastName === undefined && o.firstName === undefined), { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] }),
    cmc_validators_1.IsNotBlank({ message: ValidationErrors.NAME_REQUIRED, groups: ['claimant', 'defendant'] }),
    class_validator_1.MaxLength(255, { message: ValidationErrors.NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
], PartyDetails.prototype, "name", void 0);
__decorate([
    class_validator_1.IsDefined({ message: ValidationErrors.ADDRESS_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.ValidateNested({ groups: ['claimant', 'defendant', 'response'] })
], PartyDetails.prototype, "address", void 0);
__decorate([
    class_validator_1.ValidateIf(o => (o.phone !== undefined), { groups: ['defendant', 'response'] }),
    class_validator_1.IsNotEmpty({ message: ValidationErrors.PHONE_REQUIRED, groups: ['defendant', 'response'] }),
    class_validator_1.MaxLength(30, { message: validationErrors_1.ValidationErrors.TEXT_TOO_LONG, groups: ['defendant', 'response'] })
], PartyDetails.prototype, "phone", void 0);
__decorate([
    class_validator_1.ValidateIf(partyDetails => partyDetails.hasCorrespondenceAddress === true, { groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.IsDefined({ message: ValidationErrors.CORRESPONDENCE_ADDRESS_REQUIRED, groups: ['claimant', 'defendant', 'response'] }),
    class_validator_1.ValidateNested({ groups: ['claimant', 'defendant', 'response'] })
], PartyDetails.prototype, "correspondenceAddress", void 0);
exports.PartyDetails = PartyDetails;
