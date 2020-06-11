"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defence_1 = require("integration-test/tests/citizen/defence/steps/defence");
const defence_type_1 = require("integration-test/data/defence-type");
const payment_option_1 = require("integration-test/data/payment-option");
const I = actor();
const defenceSteps = new defence_1.DefenceSteps();
class Helper {
    async enterPinNumber(claimRef, claimantEmail) {
        defenceSteps.enterClaimReference(claimRef);
        return Promise.resolve();
    }
    linkClaimToDefendant(defendantEmail) {
        defenceSteps.loginAsDefendant(defendantEmail);
    }
    startResponseFromDashboard(claimRef) {
        I.click(claimRef);
        I.click('Respond to claim');
    }
    finishResponse(testData, isRequestMoreTimeToRespond = true, expectPhonePage = false) {
        if (testData.defenceType === undefined) {
            testData.defenceType = defence_type_1.DefenceType.FULL_REJECTION_WITH_DISPUTE;
        }
        defenceSteps.loginAsDefendant(testData.defendantEmail);
        I.click(testData.claimRef);
        I.click('Respond to claim');
        defenceSteps.makeDefenceAndSubmit(testData.defendant, testData.defendantEmail, testData.defendantPartyType, testData.defenceType, isRequestMoreTimeToRespond, testData.defendantClaimsToHavePaidInFull, expectPhonePage);
    }
    // TODO: refactor with above ^^^
    finishResponseWithFullAdmission(testData) {
        if (testData.paymentOption === undefined) {
            testData.paymentOption = payment_option_1.PaymentOption.IMMEDIATELY;
        }
        defenceSteps.loginAsDefendant(testData.defendantEmail);
        I.click(testData.claimRef);
        I.click('Respond to claim');
        defenceSteps.makeFullAdmission(testData.defendant, testData.defendantPartyType, testData.paymentOption, testData.claimantName, false);
    }
    finishResponseWithHandOff(claimRef, defendant, claimant, defendantEmail, defenceType) {
        defenceSteps.loginAsDefendant(defendantEmail);
        I.click(claimRef);
        defenceSteps.sendDefenceResponseHandOff(claimRef, defendant, claimant, defenceType);
    }
    defendantViewCaseTaskList(defendantEmail) {
        defenceSteps.loginAsDefendant(defendantEmail);
    }
}
exports.Helper = Helper;
