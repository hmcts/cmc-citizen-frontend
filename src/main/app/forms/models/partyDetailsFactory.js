"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyType_1 = require("common/partyType");
const individualDetails_1 = require("forms/models/individualDetails");
const companyDetails_1 = require("forms/models/companyDetails");
const soleTraderDetails_1 = require("forms/models/soleTraderDetails");
const organisationDetails_1 = require("forms/models/organisationDetails");
class PartyDetailsFactory {
    static createInstance(type) {
        switch (type) {
            case partyType_1.PartyType.INDIVIDUAL.value:
                return new individualDetails_1.IndividualDetails();
            case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
                return new soleTraderDetails_1.SoleTraderDetails();
            case partyType_1.PartyType.COMPANY.value:
                return new companyDetails_1.CompanyDetails();
            case partyType_1.PartyType.ORGANISATION.value:
                return new organisationDetails_1.OrganisationDetails();
            default:
                throw Error(`Unknown party type: ${type}`);
        }
    }
}
exports.PartyDetailsFactory = PartyDetailsFactory;
