"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const helper_1 = require("integration-test/tests/citizen/endToEnd/steps/helper");
const user_1 = require("integration-test/tests/citizen/home/steps/user");
const helperSteps = new helper_1.Helper();
const userSteps = new user_1.UserSteps();
class ClaimantResponseTest {
    constructor() {
        this.pageSpecificValues = {
            paymentDatePage_enterDate: '2025-01-01',
            paymentPlanPage_enterRepaymentPlan: {
                equalInstalment: 5.00,
                firstPaymentDate: '2025-01-01',
                frequency: 'everyMonth'
            },
            howMuchHaveYouPaidPage_enterAmountPaidWithDateAndExplanation: {
                paidAmount: 0,
                date: '',
                explanation: ''
            },
            whyYouDisagreePage_enterReason: 'Defendant rejects all the claim because...',
            timelineEventsPage_enterTimelineEvent: {
                eventNum: 0,
                date: '1/1/2000',
                description: 'something'
            },
            evidencePage_enterEvidenceRow: {
                type: 'CONTRACTS_AND_AGREEMENTS',
                description: 'correspondence',
                comment: 'have this evidence'
            }
        };
    }
    static async prepareData(I, defendantPartyType, claimantPartyType) {
        const claimantEmail = userSteps.getClaimantEmail();
        const defendantEmail = userSteps.getDefendantEmail();
        const claimData = test_data_1.createClaimData(defendantPartyType, claimantPartyType);
        const claimRef = await I.createClaim(claimData, claimantEmail);
        await helperSteps.enterPinNumber(claimRef, claimantEmail);
        const testData = new ClaimantResponseTest();
        testData.claimRef = claimRef;
        testData.claimantEmail = claimantEmail;
        testData.defendantEmail = defendantEmail;
        testData.defendantPartyType = defendantPartyType;
        testData.claimantPartyType = claimantPartyType;
        return testData;
    }
}
exports.ClaimantResponseTest = ClaimantResponseTest;
