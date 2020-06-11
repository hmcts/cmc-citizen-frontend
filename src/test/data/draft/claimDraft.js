"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const partyDetails_1 = require("test/data/draft/partyDetails");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestDateType_1 = require("common/interestDateType");
const yesNoOption_1 = require("models/yesNoOption");
const interestType_1 = require("claim/form/models/interestType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const claimValue_1 = require("eligibility/model/claimValue");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
exports.claimDraft = {
    externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
    readResolveDispute: true,
    readCompletingClaim: true,
    eligibility: {
        claimantAddress: yesNoOption_1.YesNoOption.YES,
        defendantAddress: yesNoOption_1.YesNoOption.YES,
        claimValue: claimValue_1.ClaimValue.UNDER_10000,
        eighteenOrOver: yesNoOption_1.YesNoOption.YES,
        defendantAge: defendantAgeOption_1.DefendantAgeOption.YES,
        governmentDepartment: yesNoOption_1.YesNoOption.NO,
        helpWithFees: yesNoOption_1.YesNoOption.NO,
        claimIsForTenancyDeposit: yesNoOption_1.YesNoOption.NO
    },
    claimant: {
        payment: {
            reference: '123',
            date_created: 12345,
            amount: 10000,
            status: 'Success',
            _links: {
                next_url: {
                    href: 'any href',
                    method: 'POST'
                }
            }
        },
        partyDetails: partyDetails_1.individualDetails,
        phone: {
            number: '07000000000'
        }
    },
    defendant: {
        partyDetails: partyDetails_1.defendantIndividualDetails,
        email: {
            address: 'defendant@example.com'
        },
        mobilePhone: {
            number: '07284798778'
        }
    },
    amount: {
        rows: [
            {
                reason: 'Valid reason',
                amount: 1
            }
        ]
    },
    interest: {
        option: yesNoOption_1.YesNoOption.YES
    },
    interestType: {
        option: interestType_1.InterestTypeOption.SAME_RATE
    },
    interestRate: {
        type: interestRateOption_1.InterestRateOption.DIFFERENT,
        rate: 10,
        reason: 'Special case'
    },
    interestDate: {
        type: interestDateType_1.InterestDateType.CUSTOM
    },
    interestStartDate: {
        date: {
            day: 1,
            month: 1,
            year: 2018
        },
        reason: 'reason'
    },
    interestEndDate: {
        option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
    },
    reason: {
        reason: 'Because he did...'
    },
    timeline: {
        rows: []
    },
    evidence: {
        rows: []
    }
};
