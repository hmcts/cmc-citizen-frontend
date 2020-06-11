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
exports.individual = Object.assign(Object.assign({ type: partyType_1.PartyType.INDIVIDUAL.value, name: 'John Smith' }, exports.addressCorrespondenceAddress), { dateOfBirth: '1999-01-01', phone: '0700000001', email: 'individual@example.com' });
exports.individualDefendant = Object.assign(Object.assign({}, exports.individual), { name: 'Mr. John Smith', title: 'Mr.', firstName: 'John', lastName: 'Smith' });
exports.soleTrader = Object.assign(Object.assign({ type: partyType_1.PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value, name: 'SoleTrader Smith', businessName: 'SoleTrader Ltd.' }, exports.addressCorrespondenceAddress), { phone: '0700000002', email: 'sole-trader@example.com' });
exports.soleTraderDefendant = Object.assign(Object.assign({}, exports.soleTrader), { businessName: 'Defendant SoleTrader Ltd.', name: 'Defendant SoleTrader', title: undefined, firstName: 'Defendant', lastName: 'SoleTrader' });
exports.company = Object.assign(Object.assign({ type: partyType_1.PartyType.COMPANY.value, name: 'Company Ltd.', contactPerson: 'Company Smith' }, exports.addressCorrespondenceAddress), { phone: '0700000003', email: 'company@example.com' });
exports.organisation = Object.assign(Object.assign({ type: partyType_1.PartyType.ORGANISATION.value, name: 'Organisation.', contactPerson: 'Organisation Smith' }, exports.addressCorrespondenceAddress), { email: 'organisation@example.com' });
exports.organisationWithPhone = Object.assign(Object.assign({ type: partyType_1.PartyType.ORGANISATION.value, name: 'Organisation.', contactPerson: 'Organisation Smith' }, exports.addressCorrespondenceAddress), { phone: '0700000004', email: 'organisation@example.com' });
