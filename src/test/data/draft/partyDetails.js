"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyType_1 = require("common/partyType");
exports.addressCorrespondenceAddress = {
    address: {
        line1: 'Flat 2',
        line2: 'Street 2',
        line3: 'Cool house name',
        city: 'London',
        postcode: 'E2 8FA'
    },
    hasCorrespondenceAddress: true,
    correspondenceAddress: {
        line1: 'Flat 20',
        line2: 'Street 20',
        line3: 'Cooler house name',
        city: 'Belfast',
        postcode: 'BT2 5GB'
    }
};
exports.individualDetails = Object.assign(Object.assign({ type: partyType_1.PartyType.INDIVIDUAL.value, name: 'John Smith' }, exports.addressCorrespondenceAddress), { dateOfBirth: {
        known: true,
        date: {
            year: 1999,
            month: 1,
            day: 1
        }
    } });
exports.individualSplitNameDetails = Object.assign(Object.assign({}, exports.individualDetails), { name: 'Mr. John Smith', title: 'Mr.', firstName: 'John', lastName: 'Smith' });
exports.defendantIndividualDetails = Object.assign(Object.assign({}, exports.individualDetails), { title: 'Mr.', firstName: 'John', lastName: 'Smith' });
exports.soleTraderDetails = Object.assign({ type: partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name: 'SoleTrader Smith', businessName: 'SoleTrader Ltd.' }, exports.addressCorrespondenceAddress);
exports.claimantSoleTraderDetails = Object.assign({ type: partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name: 'Claimant SoleTrader', businessName: 'Claimant SoleTrader Ltd.' }, exports.addressCorrespondenceAddress);
exports.defendantSoleTraderDetails = Object.assign({ type: partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name: 'Defendant SoleTrader', title: undefined, firstName: 'Defendant', lastName: 'SoleTrader', businessName: 'Defendant SoleTrader Ltd.' }, exports.addressCorrespondenceAddress);
exports.companyDetails = Object.assign({ type: partyType_1.PartyType.COMPANY.value, name: 'Company Ltd.', contactPerson: 'Company Smith' }, exports.addressCorrespondenceAddress);
exports.organisationDetails = Object.assign({ type: partyType_1.PartyType.ORGANISATION.value, name: 'Organisation.', contactPerson: 'Organisation Smith' }, exports.addressCorrespondenceAddress);
function partyDetails(partyType) {
    switch (partyType) {
        case partyType_1.PartyType.INDIVIDUAL.value:
            return exports.individualDetails;
        case partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
            return exports.soleTraderDetails;
        case partyType_1.PartyType.COMPANY.value:
            return exports.companyDetails;
        case partyType_1.PartyType.ORGANISATION.value:
            return exports.organisationDetails;
        default:
            throw new Error(`Unknown party type: ${partyType}`);
    }
}
exports.partyDetails = partyDetails;
