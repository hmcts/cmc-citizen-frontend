"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const partyType_1 = require("common/partyType");
function prepareClaimDraft(userEmailAddress) {
    return {
        externalId: uuid(),
        claimant: {
            payment: {},
            phone: {
                number: '(0)207 127 0000'
            },
            partyDetails: {
                address: {
                    line1: 'Street 1',
                    line2: 'Street 2',
                    line3: 'Street 3',
                    city: 'London',
                    postcode: 'SW1H 9AJ',
                    addressVisible: true,
                    addressSelectorVisible: false,
                    enterManually: true
                },
                hasCorrespondenceAddress: false,
                correspondenceAddress: {
                    addressVisible: true,
                    addressSelectorVisible: false,
                    enterManually: false
                },
                name: 'Jan Clark',
                type: partyType_1.PartyType.INDIVIDUAL.value,
                dateOfBirth: {
                    known: true,
                    date: {
                        year: 2000,
                        month: 1,
                        day: 1
                    }
                }
            }
        },
        defendant: {
            partyDetails: {
                hasCorrespondenceAddress: false,
                address: {
                    line1: 'Flat 3A',
                    line2: 'Street 1',
                    line3: 'Middle Road',
                    city: 'London',
                    postcode: 'SW1H 9AJ',
                    addressVisible: true,
                    addressSelectorVisible: false,
                    enterManually: true
                },
                correspondenceAddress: {
                    addressVisible: true,
                    addressSelectorVisible: false,
                    enterManually: false
                },
                name: 'Mrs. Mary Richards',
                type: partyType_1.PartyType.INDIVIDUAL.value,
                title: 'Mrs.',
                firstName: 'Mary',
                lastName: 'Richards'
            },
            email: {
                address: userEmailAddress
            },
            phone: {
                number: ''
            }
        },
        amount: {
            type: 'breakdown',
            rows: [
                {
                    reason: 'Roof Fix & repairs to leak',
                    amount: 75
                },
                {},
                {},
                {}
            ]
        },
        interest: {
            option: {
                option: 'no'
            }
        },
        interestType: {},
        interestRate: {},
        interestDate: {},
        interestStartDate: {
            date: {}
        },
        interestEndDate: {},
        interestTotal: {},
        interestContinueClaiming: {},
        interestHowMuch: {},
        reason: {
            reason: 'A strong sense of entitlement that would explain my reasons of the claim, that the Roof work and leaks that followed were done below standards set by the council inspector'
        },
        readResolveDispute: true,
        readCompletingClaim: true,
        timeline: {
            rows: [
                {
                    date: '01 October 2017',
                    description: 'The day the first bill was issued'
                },
                {
                    date: '26 March 2018',
                    description: 'A historic day with enormous importance'
                },
                {
                    date: '14 June 2018',
                    description: 'line to explain what happened and when'
                },
                {}
            ]
        },
        evidence: {
            rows: [
                {},
                {},
                {},
                {}
            ]
        },
        eligibility: true
    };
}
exports.prepareClaimDraft = prepareClaimDraft;
