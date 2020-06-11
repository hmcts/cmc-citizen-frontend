"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const response_1 = require("response/form/models/response");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const yesNoOption_1 = require("models/yesNoOption");
const responseType_1 = require("response/form/models/responseType");
const individualDetails_1 = require("forms/models/individualDetails");
const defendant_1 = require("drafts/models/defendant");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const whenWillYouPayTask_1 = require("response/tasks/whenWillYouPayTask");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const localDateUtils_1 = require("test/localDateUtils");
const momentFactory_1 = require("shared/momentFactory");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
function validResponseDraft(paymentType) {
    const responseDraft = new responseDraft_1.ResponseDraft();
    responseDraft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
    responseDraft.partialAdmission = new responseDraft_1.PartialAdmission();
    responseDraft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.NO);
    responseDraft.partialAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
    responseDraft.partialAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentType);
    responseDraft.defendantDetails = new defendant_1.Defendant(new individualDetails_1.IndividualDetails());
    return responseDraft;
}
describe('WhenWillYouPayTask', () => {
    context('should not be completed when', () => {
        it('paymentOption is undefined', () => {
            const draft = validResponseDraft(paymentOption_1.PaymentType.IMMEDIATELY);
            draft.partialAdmission.paymentIntention.paymentOption = undefined;
            chai_1.expect(whenWillYouPayTask_1.WhenWillYouPayTask.isCompleted(draft)).to.be.false;
        });
        it('paymentOption is defined but payment date is in the past', () => {
            const draft = validResponseDraft(paymentOption_1.PaymentType.BY_SET_DATE);
            draft.partialAdmission.paymentIntention.paymentOption.option = paymentOption_1.PaymentType.BY_SET_DATE;
            draft.partialAdmission.paymentIntention.paymentDate =
                new paymentDate_1.PaymentDate(localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate().add(-10, 'day')));
            chai_1.expect(whenWillYouPayTask_1.WhenWillYouPayTask.isCompleted(draft)).to.be.false;
        });
    });
    context('should be completed when response draft is valid', () => {
        paymentOption_1.PaymentType.all().forEach(option => {
            it(`${option.value}`, () => {
                const draft = validResponseDraft(option);
                draft.partialAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(option);
                draft.partialAdmission.paymentIntention.paymentDate =
                    new paymentDate_1.PaymentDate(localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate()));
                chai_1.expect(whenWillYouPayTask_1.WhenWillYouPayTask.isCompleted(draft)).to.be.true;
            });
        });
    });
});
