"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claim_1 = require("claims/models/claim");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const chai_1 = require("chai");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const paymentPlan_1 = require("common/payment-plan/paymentPlan");
const frequency_1 = require("common/frequency/frequency");
const momentFactory_1 = require("shared/momentFactory");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claimData_1 = require("claims/models/claimData");
const theirDetails_1 = require("claims/models/details/theirs/theirDetails");
describe('PaymentPlanHelper', () => {
    let claim;
    let draft;
    beforeEach(() => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({ courtDetermination: { disposableIncome: 1000 } });
    });
    context('createPaymentPlanFromDefendantFinancialStatement', () => {
        it('should return correct paymentPlan from defendants financial statement ', () => {
            chai_1.expect(paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft)).to.deep
                .equal(paymentPlan_1.PaymentPlan.create(200, 200, frequency_1.Frequency.WEEKLY, calculateMonthIncrement_1.calculateMonthIncrement(momentFactory_1.MomentFactory.currentDate())));
        });
        context('should return max date for instalments less than a pound a week', () => {
            it('just under the threshold', () => {
                draft.courtDetermination.disposableIncome = parseFloat(frequency_1.Frequency.WEEKLY.monthlyRatio.toFixed(2)) - 0.01;
                const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
                chai_1.expect(paymentPlan.startDate.toISOString()).to.equal(momentFactory_1.MomentFactory.maxDate().toISOString());
            });
            it('just over the threshold', () => {
                draft.courtDetermination.disposableIncome = parseFloat(frequency_1.Frequency.WEEKLY.monthlyRatio.toFixed(2)) + 0.01;
                const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
                chai_1.expect(paymentPlan.startDate.toISOString()).not.to.equal(momentFactory_1.MomentFactory.maxDate().toISOString());
            });
        });
        context('when a defendant is a business', () => {
            it('should return an undefined paymentPlan', () => {
                draft.courtDetermination.disposableIncome = parseFloat(frequency_1.Frequency.WEEKLY.monthlyRatio.toFixed(2)) + 0.01;
                claim.claimData = new claimData_1.ClaimData().deserialize({
                    defendants: new Array(new theirDetails_1.TheirDetails().deserialize({
                        type: 'organisation',
                        name: undefined,
                        address: undefined,
                        email: undefined
                    }))
                });
                const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromDefendantFinancialStatement(claim, draft);
                chai_1.expect(paymentPlan).eq(undefined);
            });
        });
    });
});
