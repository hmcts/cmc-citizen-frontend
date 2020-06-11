"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
class ClaimantTaskListPage {
    selectTaskViewDefendantResponse() {
        I.click('View the defendant’s response');
    }
    selectTaskAcceptOrRejectPartAdmit() {
        I.click('Accept or reject');
    }
    selectTaskAcceptOrRejectSpecificAmount(amount) {
        I.click(`Accept or reject the £${Number(amount).toLocaleString()}`);
    }
    selectTaskAcceptOrRejectTheirRepaymentPlan() {
        I.click('Accept or reject their repayment plan');
    }
    selectTaskChooseHowToFormaliseRepayment() {
        I.click('Choose how to formalise repayment');
    }
    selectTaskSignASettlementAgreement() {
        I.click('Sign a settlement agreement');
    }
    selectTaskCheckandSubmitYourResponse() {
        I.click('Check and submit your response');
    }
    selectTaskFreeMediation() {
        I.click('Free telephone mediation');
    }
    selectTaskHearingRequirements() {
        I.click('Give us details in case there’s a hearing');
    }
    selectTaskRequestCountyCourtJudgment() {
        I.click('Request a County Court Judgment');
    }
    selectProposeAnAlternativeRepaymentPlan() {
        I.click('Propose an alternative repayment plan');
    }
}
exports.ClaimantTaskListPage = ClaimantTaskListPage;
