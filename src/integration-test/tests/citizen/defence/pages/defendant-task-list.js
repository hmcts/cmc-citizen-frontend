"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
class DefendantTaskListPage {
    selectTaskConfirmYourDetails() {
        I.click('Confirm your details');
    }
    selectTaskMoreTimeNeededToRespond() {
        I.click('Decide if you need more time to respond');
    }
    selectChooseAResponse() {
        I.click('Choose a response');
    }
    selectTaskHowMuchPaidToClaiment() {
        I.click('How much have you paid the claimant?');
    }
    selectTaskHowMuchHaveYouPaid() {
        I.click('How much have you paid?');
    }
    selectTaskTellUsHowMuchYouHavePaid() {
        I.click('Tell us how much you’ve paid');
    }
    selectTaskHowMuchMoneyBelieveYouOwe() {
        I.click('How much money do you admit you owe?');
    }
    selectTaskDecideHowWillYouPay() {
        I.click('Decide how you’ll pay');
    }
    selectTaskWhenDidYouPay() {
        I.click('When did you pay?');
    }
    selectTaskWhyDoYouDisagreeWithTheClaim() {
        I.click('Tell us why you disagree with the claim');
    }
    selectTaskWhyDoYouDisagreeWithTheAmountClaimed() {
        I.click('Why do you disagree with the amount claimed?');
    }
    selectTaskWhenWillYouPay() {
        I.click('When will you pay');
    }
    selectYourRepaymentPlanTask() {
        I.click('Your repayment plan');
    }
    selectShareYourFinancialDetailsTask() {
        I.click('Share your financial details');
    }
    selectTaskCheckAndSendYourResponse() {
        I.click('Check and submit your response');
    }
    selectTaskFreeMediation() {
        I.click('Free telephone mediation');
    }
    selectTaskHearingRequirements() {
        I.click('Give us details in case there’s a hearing');
    }
}
exports.DefendantTaskListPage = DefendantTaskListPage;
