"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claim_1 = require("claims/models/claim");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const decisionType_1 = require("common/court-calculations/decisionType");
const payment_option_1 = require("claimant-response/routes/payment-option");
const chai_1 = require("chai");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const paymentOption_1 = require("claims/models/paymentOption");
const paymentOption_2 = require("shared/components/payment-intention/model/paymentOption");
const payment_date_1 = require("claimant-response/routes/payment-date");
const payment_plan_1 = require("claimant-response/routes/payment-plan");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const momentFactory_1 = require("shared/momentFactory");
function draftClaimantResponseInstalmentsTestData(draftClaimantResponseInstalments, disposableIncomeVal) {
    return new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
        alternatePaymentMethod: {
            paymentOption: new paymentOption_2.PaymentOption(paymentOption_2.PaymentType.INSTALMENTS),
            paymentPlan: {
                totalAmount: 1060,
                instalmentAmount: 100,
                paymentSchedule: {
                    value: paymentSchedule_1.PaymentSchedule.EVERY_MONTH
                },
                firstPaymentDate: {
                    year: 2018,
                    month: 12,
                    day: 31
                },
                completionDate: {
                    year: 2019,
                    month: 12,
                    day: 30
                },
                paymentLength: ''
            }
        },
        courtDetermination: { disposableIncome: disposableIncomeVal }
    });
}
describe('PaymentIntentionHelper', () => {
    let claimWithDefendantInstalmentsResponse;
    let claimWithDefendantInstalmentsResponseNoDisposableIncome;
    let claimWithDefendantPayBySetDateResponse;
    let draftClaimantResponseImmediately;
    let draftClaimantResponsePayBySetDate;
    let draftClaimantResponseInstalments;
    let draftClaimantResponseInstalmentsWithNegativeDisposableIncome;
    beforeEach(() => {
        claimWithDefendantInstalmentsResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
        claimWithDefendantInstalmentsResponseNoDisposableIncome = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome));
        claimWithDefendantPayBySetDateResponse = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj));
        draftClaimantResponseImmediately = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: new paymentOption_2.PaymentOption(paymentOption_2.PaymentType.IMMEDIATELY)
            },
            courtDetermination: { disposableIncome: 100 }
        });
        draftClaimantResponsePayBySetDate = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({
            alternatePaymentMethod: {
                paymentOption: new paymentOption_2.PaymentOption(paymentOption_2.PaymentType.BY_SET_DATE),
                paymentDate: {
                    date: {
                        year: 2050,
                        month: 12,
                        day: 31
                    }
                }
            },
            courtDetermination: { disposableIncome: 100 }
        });
        draftClaimantResponseInstalments = draftClaimantResponseInstalmentsTestData(draftClaimantResponseInstalments, 1000);
        draftClaimantResponseInstalmentsWithNegativeDisposableIncome = draftClaimantResponseInstalmentsTestData(draftClaimantResponseInstalments, -100);
    });
    context('getDefendantPaymentIntention', () => {
        it('should return correct instance of PaymentIntention', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
            chai_1.expect(payment_date_1.PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
        });
        it('should return payment intention with Defendants Payment Option', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(paymentOption_1.PaymentOption.BY_SPECIFIED_DATE);
            chai_1.expect(payment_date_1.PaymentDatePage.generateCourtCalculatedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(paymentOption_1.PaymentOption.BY_SPECIFIED_DATE);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtCalculatedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse).paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
        });
    });
    context('generateCourtOfferedPaymentIntention', () => {
        it('should return correct instance of PaymentIntention', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
            chai_1.expect(payment_date_1.PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT)).to.be.instanceOf(paymentIntention_1.PaymentIntention);
        });
        it('should return payment intention with Defendants Payment Option', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
            chai_1.expect(payment_date_1.PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.DEFENDANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
        });
        it('should return payment intention with Defendants Payment Option but with claimants start date when defendant have no disposable income', () => {
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalmentsWithNegativeDisposableIncome, claimWithDefendantInstalmentsResponseNoDisposableIncome, decisionType_1.DecisionType.DEFENDANT).repaymentPlan.firstPaymentDate.toISOString()).to.be.deep.equal(momentFactory_1.MomentFactory.currentDate().add(80, 'days').toISOString());
        });
        it('should return payment intention with Claimants Payment Option', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.CLAIMANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.IMMEDIATELY);
            chai_1.expect(payment_date_1.PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.CLAIMANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.BY_SPECIFIED_DATE);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.CLAIMANT).paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
        });
        it('should return payment intention with claimants instalments payment frequency converted to defendants payment frequency', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(paymentSchedule_1.PaymentSchedule.EACH_WEEK);
            chai_1.expect(payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(paymentSchedule_1.PaymentSchedule.EACH_WEEK);
        });
        it('should return payment intention based on defendants financial statement with monthly frequency payments', () => {
            const paymentIntention = payment_plan_1.PaymentPlanPage.generateCourtOfferedPaymentIntention(draftClaimantResponseInstalments, claimWithDefendantPayBySetDateResponse, decisionType_1.DecisionType.COURT);
            chai_1.expect(paymentIntention.repaymentPlan.paymentSchedule).to.be.equal(paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
            chai_1.expect(paymentIntention.paymentOption).to.be.equal(paymentOption_1.PaymentOption.INSTALMENTS);
        });
        it('should return payment intention with monthly instalments when claimant asks to pay immediately', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.generateCourtOfferedPaymentIntention(draftClaimantResponseImmediately, claimWithDefendantPayBySetDateResponse, decisionType_1.DecisionType.COURT).repaymentPlan.paymentSchedule).to.be.equal(paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
        });
        it('should return payment intention with payment option as pay by set date', () => {
            const paymentIntention = payment_date_1.PaymentDatePage.generateCourtOfferedPaymentIntention(draftClaimantResponsePayBySetDate, claimWithDefendantInstalmentsResponse, decisionType_1.DecisionType.COURT);
            chai_1.expect(paymentIntention.paymentOption).to.be.equal(paymentOption_1.PaymentOption.BY_SPECIFIED_DATE);
        });
    });
    context('getCourtDecision', () => {
        it('should return court Decision as COURT', () => {
            chai_1.expect(payment_option_1.PaymentOptionPage.getCourtDecision(draftClaimantResponseImmediately, claimWithDefendantInstalmentsResponse)).to.be.equal(decisionType_1.DecisionType.COURT);
        });
    });
});
