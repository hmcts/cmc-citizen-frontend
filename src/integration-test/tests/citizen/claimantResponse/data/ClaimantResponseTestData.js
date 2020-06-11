"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
class ClaimantResponseTestData {
    constructor() {
        this.isExpectingToSeeHowTheyWantToPayPage = false;
        this.isExpectingToSeeCourtOfferedInstalmentsPage = false;
        this.pageSpecificValues = {
            paymentDatePageEnterDate: '2025-01-01',
            paymentPlanPageEnterRepaymentPlan: {
                equalInstalment: 5.00,
                firstPaymentDate: '2025-01-01',
                frequency: 'everyMonth'
            },
            howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation: {
                paidAmount: 0,
                date: '',
                explanation: ''
            },
            whyYouDisagreePageEnterReason: 'Defendant rejects all the claim because...',
            timelineEventsPageEnterTimelineEvent: {
                eventNum: 0,
                date: '1/1/2000',
                description: 'something'
            },
            evidencePageEnterEvidenceRow: {
                type: 'CONTRACTS_AND_AGREEMENTS',
                description: 'correspondence',
                comment: 'have this evidence'
            },
            settleClaimEnterDate: '2018-01-01'
        };
    }
}
exports.ClaimantResponseTestData = ClaimantResponseTestData;
class UnreasonableClaimantResponseTestData {
    constructor() {
        this.isExpectingToSeeHowTheyWantToPayPage = false;
        this.isExpectingToSeeCourtOfferedInstalmentsPage = false;
        this.pageSpecificValues = {
            paymentDatePageEnterDate: '2025-01-01',
            paymentPlanPageEnterRepaymentPlan: {
                equalInstalment: 50.00,
                firstPaymentDate: moment().add(50, 'days').toISOString(),
                frequency: 'everyWeek'
            },
            howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation: {
                paidAmount: 0,
                date: '',
                explanation: ''
            },
            whyYouDisagreePageEnterReason: 'Defendant rejects all the claim because...',
            timelineEventsPageEnterTimelineEvent: {
                eventNum: 0,
                date: '1/1/2000',
                description: 'something'
            },
            evidencePageEnterEvidenceRow: {
                type: 'CONTRACTS_AND_AGREEMENTS',
                description: 'correspondence',
                comment: 'have this evidence'
            },
            settleClaimEnterDate: undefined
        };
    }
}
exports.UnreasonableClaimantResponseTestData = UnreasonableClaimantResponseTestData;
