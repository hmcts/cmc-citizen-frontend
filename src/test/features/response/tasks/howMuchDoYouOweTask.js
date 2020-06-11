"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const response_1 = require("response/form/models/response");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const yesNoOption_1 = require("models/yesNoOption");
const responseType_1 = require("response/form/models/responseType");
const howMuchDoYouOweTask_1 = require("response/tasks/howMuchDoYouOweTask");
const howMuchDoYouOwe_1 = require("response/form/models/howMuchDoYouOwe");
const individualDetails_1 = require("forms/models/individualDetails");
const defendant_1 = require("drafts/models/defendant");
const amountOwed = 100;
const totalAmount = 500;
function validResponseDraft() {
    const responseDraft = new responseDraft_1.ResponseDraft();
    responseDraft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
    responseDraft.partialAdmission = new responseDraft_1.PartialAdmission();
    responseDraft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.NO);
    responseDraft.partialAdmission.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe(amountOwed, totalAmount);
    responseDraft.defendantDetails = new defendant_1.Defendant(new individualDetails_1.IndividualDetails());
    return responseDraft;
}
describe('HowMuchDoYouOweTask', () => {
    context('should not be completed when', () => {
        it('howMuchDoYouOwe is undefined', () => {
            const draft = validResponseDraft();
            draft.partialAdmission.howMuchDoYouOwe = undefined;
            chai_1.expect(howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)).to.be.false;
        });
        context('amount is', () => {
            it('eq 0', () => {
                const draft = validResponseDraft();
                draft.partialAdmission.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe(0);
                chai_1.expect(howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)).to.be.false;
            });
            it('less than 0', () => {
                const draft = validResponseDraft();
                draft.partialAdmission.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe(-10);
                chai_1.expect(howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)).to.be.false;
            });
            it('greater than claimed amount', () => {
                const draft = validResponseDraft();
                draft.partialAdmission.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe(totalAmount + 1, totalAmount);
                chai_1.expect(howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)).to.be.false;
            });
        });
    });
    it('should be completed when howMuchDoYouOwe is valid', () => {
        const draft = validResponseDraft();
        chai_1.expect(howMuchDoYouOweTask_1.HowMuchDoYouOweTask.isCompleted(draft)).to.be.true;
    });
});
