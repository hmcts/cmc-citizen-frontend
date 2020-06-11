"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const submitResponseButton = {
    submit: 'input[type=submit]'
};
class ClaimantCheckYourAnswersPage {
    submitResponse() {
        I.click(submitResponseButton.submit);
    }
    verifyClaimantResponseToAcceptingPartAdmissionImmediatelyOffer() {
        I.see('Do you accept or reject the defendant’s admission?');
        I.see('I accept this amount');
    }
    verifyClaimantResponseToRejectingPartAdmissionImmediatelyOffer() {
        I.see('Do you accept or reject the defendant’s admission?');
        I.see('I reject this amount');
    }
}
exports.ClaimantCheckYourAnswersPage = ClaimantCheckYourAnswersPage;
