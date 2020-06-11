"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interestType_1 = require("claims/models/interestType");
const madeBy_1 = require("claims/models/madeBy");
const party_type_1 = require("integration-test/data/party-type");
const interestDateType_1 = require("common/interestDateType");
const SampleParty = require("test/data/entity/party");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
function getPartyForType(type) {
    switch (type) {
        case party_type_1.PartyType.SOLE_TRADER:
            return SampleParty.soleTrader;
        case party_type_1.PartyType.INDIVIDUAL:
            return SampleParty.individual;
        case party_type_1.PartyType.ORGANISATION:
            return SampleParty.organisation;
        case party_type_1.PartyType.COMPANY:
            return SampleParty.company;
    }
}
exports.getPartyForType = getPartyForType;
function createClaim(claimant, defendant, currentParty = madeBy_1.MadeBy.CLAIMANT) {
    return Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueCommonObj), { features: ['directionsQuestionnaire'], response: currentParty === madeBy_1.MadeBy.CLAIMANT ? claimStoreServiceMock.sampleDefendantResponseObj.response : undefined, claim: {
            claimants: [
                Object.assign({}, getPartyForType(claimant))
            ],
            defendants: [
                Object.assign({}, getPartyForType(defendant))
            ],
            payment: {
                id: '12',
                amount: 2500,
                state: { status: 'failed' }
            },
            amount: {
                type: 'breakdown',
                rows: [{ reason: 'Reason', amount: 200 }]
            },
            interest: {
                type: interestType_1.InterestType.STANDARD,
                rate: 10,
                reason: 'Special case',
                interestDate: {
                    type: interestDateType_1.InterestDateType.SUBMISSION,
                    endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                }
            },
            reason: 'Because I can',
            feeAmountInPennies: 2500,
            timeline: { rows: [{ date: 'a', description: 'b' }] }
        } });
}
exports.createClaim = createClaim;
