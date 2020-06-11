"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyType_1 = require("common/partyType");
const individual_1 = require("claims/models/details/theirs/individual");
const company_1 = require("claims/models/details/theirs/company");
const soleTrader_1 = require("claims/models/details/theirs/soleTrader");
const organisation_1 = require("claims/models/details/theirs/organisation");
const address_1 = require("claims/converters/address");
function convertDefendantDetails(defendant, email) {
    switch (defendant.type) {
        case partyType_1.PartyType.INDIVIDUAL.value:
            const individualDetails = defendant;
            const result = new individual_1.Individual(individualDetails.title, individualDetails.firstName, individualDetails.lastName, address_1.convertAddress(individualDetails.address), email);
            result.dateOfBirth = individualDetails.dateOfBirth.known ? individualDetails.dateOfBirth.date.asString() : undefined;
            return result;
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            const soleTraderDetails = defendant;
            return new soleTrader_1.SoleTrader(soleTraderDetails.title, soleTraderDetails.firstName, soleTraderDetails.lastName, address_1.convertAddress(soleTraderDetails.address), email, soleTraderDetails.businessName);
        case partyType_1.PartyType.COMPANY.value:
            const companyDetails = defendant;
            return new company_1.Company(companyDetails.name, address_1.convertAddress(companyDetails.address), email, companyDetails.contactPerson);
        case partyType_1.PartyType.ORGANISATION.value:
            const organisationDetails = defendant;
            return new organisation_1.Organisation(organisationDetails.name, address_1.convertAddress(organisationDetails.address), email, organisationDetails.contactPerson);
        default:
            throw Error(`Unknown defendant type ${defendant.type}`);
    }
}
exports.convertDefendantDetails = convertDefendantDetails;
