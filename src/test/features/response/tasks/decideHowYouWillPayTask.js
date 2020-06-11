"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const localDate_1 = require("forms/models/localDate");
const decideHowYouWillPayTask_1 = require("response/tasks/decideHowYouWillPayTask");
const responseDraft_1 = require("response/draft/responseDraft");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const momentFactory_1 = require("shared/momentFactory");
const localDateUtils_1 = require("test/localDateUtils");
const individualDetails_1 = require("forms/models/individualDetails");
const defendant_1 = require("drafts/models/defendant");
const responseType_1 = require("response/form/models/responseType");
const response_1 = require("response/form/models/response");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
function validResponseDraftWith(paymentType) {
    const responseDraft = new responseDraft_1.ResponseDraft();
    responseDraft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
    responseDraft.fullAdmission = new responseDraft_1.FullAdmission();
    responseDraft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
    responseDraft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentType);
    switch (paymentType) {
        case paymentOption_1.PaymentType.BY_SET_DATE:
            responseDraft.fullAdmission.paymentIntention.paymentDate = new paymentDate_1.PaymentDate(localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate()));
            break;
    }
    responseDraft.defendantDetails = new defendant_1.Defendant(new individualDetails_1.IndividualDetails());
    return responseDraft;
}
describe('DecideHowYouWillPayTask', () => {
    context('should not be completed when', () => {
        it('payment object is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.fullAdmission = new responseDraft_1.FullAdmission();
            draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
            draft.fullAdmission.paymentIntention.paymentOption = undefined;
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(draft)).to.be.false;
        });
        it('payment option is undefined', () => {
            const draft = new responseDraft_1.ResponseDraft();
            draft.fullAdmission = new responseDraft_1.FullAdmission();
            draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
            draft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(undefined);
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(draft)).to.be.false;
        });
    });
    context('when pay by set date is selected', () => {
        let responseDraft;
        beforeEach(() => {
            responseDraft = validResponseDraftWith(paymentOption_1.PaymentType.BY_SET_DATE);
        });
        it('should not be completed when payment date wrapper is undefined', () => {
            responseDraft.fullAdmission.paymentIntention.paymentDate = undefined;
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false;
        });
        it('should not be completed when payment date is undefined', () => {
            responseDraft.fullAdmission.paymentIntention.paymentDate.date = undefined;
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false;
        });
        it('should not be completed when payment date is not valid', () => {
            responseDraft.fullAdmission.paymentIntention.paymentDate.date = new localDate_1.LocalDate();
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false;
        });
        it('should not be completed when payment date is not valid - date in the past', () => {
            responseDraft.fullAdmission.paymentIntention.paymentDate.date = localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate().add(-10, 'day'));
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.false;
        });
        it('should be completed when payment date is today', () => {
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true;
        });
    });
    context('when pay by instalments is selected', () => {
        let responseDraft;
        beforeEach(() => {
            responseDraft = validResponseDraftWith(paymentOption_1.PaymentType.INSTALMENTS);
        });
        it('should be completed', () => {
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true;
        });
    });
    context('when pay immediately is selected', () => {
        let responseDraft;
        beforeEach(() => {
            responseDraft = validResponseDraftWith(paymentOption_1.PaymentType.IMMEDIATELY);
        });
        it('should be completed', () => {
            chai_1.expect(decideHowYouWillPayTask_1.DecideHowYouWillPayTask.isCompleted(responseDraft)).to.be.true;
        });
    });
});
