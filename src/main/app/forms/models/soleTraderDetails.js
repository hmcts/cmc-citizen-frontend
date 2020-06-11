"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const partyType_1 = require("common/partyType");
const splitNamedPartyDetails_1 = require("forms/models/splitNamedPartyDetails");
class ValidationErrors {
}
exports.ValidationErrors = ValidationErrors;
ValidationErrors.ORGANISATION_NAME_TOO_LONG = 'Enter trading as name no longer than $constraint1 characters';
class SoleTraderDetails extends splitNamedPartyDetails_1.SplitNamedPartyDetails {
    constructor() {
        super();
        this.type = partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value;
    }
    static fromObject(input) {
        if (input == null) {
            return input;
        }
        let deserialized = new SoleTraderDetails();
        Object.assign(deserialized, splitNamedPartyDetails_1.SplitNamedPartyDetails.fromObject(input));
        deserialized.businessName = input.businessName;
        deserialized.type = partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value;
        return deserialized;
    }
    deserialize(input) {
        if (input) {
            Object.assign(this, new splitNamedPartyDetails_1.SplitNamedPartyDetails().deserialize(input));
            this.businessName = input.businessName;
            this.type = partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value;
        }
        return this;
    }
}
__decorate([
    class_validator_1.MaxLength(35, { message: ValidationErrors.ORGANISATION_NAME_TOO_LONG, groups: ['claimant', 'defendant'] })
], SoleTraderDetails.prototype, "businessName", void 0);
exports.SoleTraderDetails = SoleTraderDetails;
