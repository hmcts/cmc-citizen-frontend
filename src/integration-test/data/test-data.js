"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_type_1 = require("integration-test/data/party-type");
const interest_type_1 = require("integration-test/data/interest-type");
const uuid = require("uuid");
const moment = require("moment");
exports.DEFAULT_PASSWORD = process.env.SMOKE_TEST_USER_PASSWORD;
exports.SMOKE_TEST_CITIZEN_USERNAME = process.env.SMOKE_TEST_CITIZEN_USERNAME;
exports.SMOKE_TEST_USER_PASSWORD = process.env.SMOKE_TEST_USER_PASSWORD;
exports.claimFee = 25.00;
exports.fixedInterestAmount = 100;
exports.dailyInterestAmount = 5;
exports.claimAmount = {
    type: 'breakdown',
    rows: [
        { reason: 'Reason', amount: 10.00 },
        { reason: 'Reason', amount: 20.50 },
        { reason: 'Reason', amount: 50.00 }
    ],
    getClaimTotal() {
        return this.rows[0].amount + this.rows[1].amount + this.rows[2].amount;
    },
    getTotal() {
        return this.getClaimTotal() + exports.claimFee;
    }
};
exports.postcodeLookupQuery = {
    postcode: 'SW2 1AN',
    address: '10, DALBERG ROAD, LONDON, SW2 1AN'
};
exports.claimReason = 'My reasons for the claim are that I am owed this money for a variety of reason, these being...';
function createClaimData(claimantType, defendantType, hasEmailAddress = true, interestType = interest_type_1.InterestType.STANDARD) {
    let claimData = {
        claimants: [createClaimant(claimantType)],
        defendants: [createDefendant(defendantType, hasEmailAddress)],
        payment: {
            amount: exports.claimFee * 100,
            reference: 'RC-1524-6488-1670-7520',
            status: 'success'
        },
        feeAmountInPennies: exports.claimFee * 100,
        amount: exports.claimAmount,
        interest: {
            type: 'no interest'
        },
        reason: exports.claimReason,
        timeline: { rows: [{ date: 'may', description: 'ok' }] },
        externalId: uuid(),
        get total() {
            switch (interestType) {
                case interest_type_1.InterestType.STANDARD:
                    return this.amount.getClaimTotal() + exports.claimFee;
                case interest_type_1.InterestType.BREAKDOWN:
                    return this.amount.getClaimTotal() + exports.fixedInterestAmount + exports.claimFee;
            }
        },
        moneyReceivedOn: null
    };
    switch (interestType) {
        case interest_type_1.InterestType.BREAKDOWN:
            claimData.interest = {
                type: 'breakdown',
                interestBreakdown: {
                    totalAmount: exports.fixedInterestAmount,
                    explanation: 'up to today'
                },
                specificDailyAmount: exports.dailyInterestAmount
            };
            claimData.interest.interestDate = {
                endDateType: 'settled_or_judgment'
            };
            break;
        case interest_type_1.InterestType.STANDARD:
            claimData.interest = {
                type: 'standard',
                rate: 8
            };
            claimData.interest.interestDate = {
                type: 'submission'
            };
            break;
    }
    return claimData;
}
exports.createClaimData = createClaimData;
function createClaimant(type) {
    const claimant = {
        type: type,
        name: undefined,
        address: {
            line1: '10, DALBERG ROAD',
            line2: 'Brixton',
            city: 'LONDON',
            postcode: 'SW2 1AN'
        },
        correspondenceAddress: {
            line1: '234 Acacia Road',
            line2: 'a really cool place',
            city: 'Edinburgh',
            postcode: 'G72 7ZY'
        },
        phone: '07700000001'
    };
    switch (type) {
        case party_type_1.PartyType.INDIVIDUAL:
            claimant.name = 'John Smith';
            claimant.dateOfBirth = '1982-07-26';
            break;
        case party_type_1.PartyType.SOLE_TRADER:
            claimant.name = 'Mr. Sole trader';
            break;
        case party_type_1.PartyType.COMPANY:
            claimant.name = 'Claimant company Inc';
            claimant.contactPerson = 'John Smith';
            break;
        case party_type_1.PartyType.ORGANISATION:
            claimant.name = 'United Nations';
            claimant.contactPerson = 'John Smith';
            break;
    }
    return claimant;
}
exports.createClaimant = createClaimant;
function createDefendant(type, hasEmailAddress = false) {
    const defendant = {
        type: type,
        name: undefined,
        address: {
            line1: '11 Dalberg road',
            line2: 'Brixton',
            city: 'London',
            postcode: 'SW2 1AN'
        },
        phone: '07700000002',
        email: hasEmailAddress ? new UserEmails().getDefendant() : undefined
    };
    switch (type) {
        case party_type_1.PartyType.INDIVIDUAL:
            defendant.name = 'Mrs. Rose Smith';
            defendant.title = 'Mrs.';
            defendant.firstName = 'Rose';
            defendant.lastName = 'Smith';
            defendant.dateOfBirth = '1982-07-26';
            break;
        case party_type_1.PartyType.SOLE_TRADER:
            defendant.name = 'Sole fish trader';
            defendant.firstName = 'Sole fish';
            defendant.lastName = 'trader';
            break;
        case party_type_1.PartyType.COMPANY:
            defendant.name = 'Defendant company Inc';
            defendant.contactPerson = 'Rose Smith';
            break;
        case party_type_1.PartyType.ORGANISATION:
            defendant.name = 'OrgBritish Red Cross';
            defendant.contactPerson = 'Rose Smith';
            break;
    }
    return defendant;
}
exports.createDefendant = createDefendant;
function createResponseData(defendantType) {
    return {
        responseType: 'FULL_DEFENCE',
        defenceType: 'DISPUTE',
        defendant: createDefendant(defendantType, false),
        moreTimeNeeded: 'no',
        freeMediation: 'no',
        defence: 'I fully dispute this claim'
    };
}
exports.createResponseData = createResponseData;
exports.defence = {
    paidWhatIBelieveIOwe: {
        howMuchAlreadyPaid: 30.00,
        paidDate: '2016-01-01',
        explanation: 'I dont claimant full amount because'
    },
    claimAmountIsTooMuch: {
        howMuchIBelieveIOwe: 30.00,
        explanation: 'I owe this amount and not full amount because I...'
    },
    timeline: {
        events: [
            {
                date: 'Early Spring',
                description: 'Claimant accuses me of owing...'
            },
            {
                date: 'Mid Spring',
                description: 'I asked the claimant for a reason and evidence why they are doing this.'
            }
        ]
    },
    impactOfDispute: 'This dispute has affected me badly'
};
exports.offer = {
    offerText: 'My Offer is that I can only afford, x, y, z and so will only pay £X amount',
    completionDate: moment().add(6, 'months').format('YYYY-MM-DD')
};
class UserEmails {
    getUser(type) {
        let subdomain = process.env.CITIZEN_APP_URL
            .replace('https://', '')
            .replace('http://', '')
            .replace('cmc-citizen-', '')
            .split('/')[0]
            .split('.')[0];
        const postfix = moment().format('YYMMDD');
        return `civilmoneyclaims+${type}-${subdomain}-${postfix}@gmail.com`;
    }
    getClaimant() {
        return this.getUser('claimant');
    }
    getDefendant() {
        return this.getUser('defendant');
    }
}
exports.UserEmails = UserEmails;
