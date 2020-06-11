"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const responseDraft_1 = require("response/draft/responseDraft");
const momentFactory_1 = require("shared/momentFactory");
const paymentPlan_1 = require("shared/components/payment-intention/model/paymentPlan");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const localDateUtils_1 = require("test/localDateUtils");
const yourRepaymentPlanTask_1 = require("features/response/tasks/yourRepaymentPlanTask");
const localDate_1 = require("forms/models/localDate");
describe('YourRepaymentPlanTask', () => {
    [{ type: 'fullAdmission', clazz: responseDraft_1.FullAdmission }, { type: 'partialAdmission', clazz: responseDraft_1.PartialAdmission }]
        .forEach(admission => {
        describe(`for ${admission.type}`, () => {
            context('should not be completed', () => {
                it('when payment plan is undefined', () => {
                    const draft = new responseDraft_1.ResponseDraft();
                    draft[admission.type] = new admission.clazz();
                    draft[admission.type].paymentPlan = undefined;
                    chai_1.expect(yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false;
                });
                it('when payment plan is invalid', () => {
                    const draft = new responseDraft_1.ResponseDraft();
                    draft[admission.type] = new admission.clazz();
                    draft[admission.type].paymentPlan = new paymentPlan_1.PaymentPlan(undefined, undefined, undefined, undefined);
                    chai_1.expect(yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false;
                });
                it('when payment plan has first payment date in the past', () => {
                    const draft = new responseDraft_1.ResponseDraft();
                    draft[admission.type] = new admission.clazz();
                    draft[admission.type].paymentPlan = new paymentPlan_1.PaymentPlan(100, 10, localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().subtract(1, 'day')), paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
                    chai_1.expect(yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.false;
                });
            });
            context('should be completed', () => {
                it('when payment plan is valid', () => {
                    const draft = new responseDraft_1.ResponseDraft();
                    draft[admission.type] = new admission.clazz();
                    draft[admission.type].paymentPlan = new paymentPlan_1.PaymentPlan(1000, 100, localDateUtils_1.localDateFrom(momentFactory_1.MomentFactory.currentDate().add(1, 'day')), paymentSchedule_1.PaymentSchedule.EACH_WEEK);
                    chai_1.expect(yourRepaymentPlanTask_1.YourRepaymentPlanTask.isCompleted(draft[admission.type].paymentPlan)).to.be.true;
                });
            });
        });
    });
});
