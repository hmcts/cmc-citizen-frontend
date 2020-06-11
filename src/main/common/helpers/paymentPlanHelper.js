"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frequency_1 = require("common/frequency/frequency");
const responseType_1 = require("claims/models/response/responseType");
const paymentPlan_1 = require("common/payment-plan/paymentPlan");
const draftClaimantResponse_1 = require("features/claimant-response/draft/draftClaimantResponse");
const responseDraft_1 = require("features/response/draft/responseDraft");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const paymentOption_1 = require("claims/models/paymentOption");
const momentFactory_1 = require("shared/momentFactory");
const admissionHelper_1 = require("shared/helpers/admissionHelper");
class PaymentPlanHelper {
    static createPaymentPlanFromClaim(claim, draft) {
        const response = claim.response;
        if (!response) {
            return undefined;
        }
        const responseType = response.responseType;
        switch (responseType) {
            case responseType_1.ResponseType.PART_ADMISSION:
                let partialAdmissionResponse = response;
                return PaymentPlanHelper.createPaymentPlanFromClaimAdmission(partialAdmissionResponse, partialAdmissionResponse.amount, draft);
            case responseType_1.ResponseType.FULL_ADMISSION:
                return PaymentPlanHelper.createPaymentPlanFromClaimAdmission(response, claim.totalAmountTillToday, draft);
            default:
                throw new Error(`Incompatible response type: ${responseType}`);
        }
    }
    static createPaymentPlanFromClaimAdmission(response, totalAmount, draft) {
        const paymentIntention = response.paymentIntention;
        if (!paymentIntention) {
            return undefined;
        }
        if (paymentIntention.repaymentPlan) {
            return PaymentPlanHelper.createPaymentPlanFromInstallment(totalAmount, paymentIntention.repaymentPlan.instalmentAmount, frequency_1.Frequency.of(paymentIntention.repaymentPlan.paymentSchedule), paymentIntention.repaymentPlan.firstPaymentDate);
        }
        if (draft.courtDetermination.disposableIncome <= 0) {
            return PaymentPlanHelper.createPaymentPlanFromStartDate(momentFactory_1.MomentFactory.maxDate());
        }
        if (paymentIntention.paymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
            const instalmentAmount = draft.courtDetermination.disposableIncome / frequency_1.Frequency.WEEKLY.monthlyRatio;
            return PaymentPlanHelper.createPaymentPlanFromInstallment(totalAmount, instalmentAmount, frequency_1.Frequency.WEEKLY, calculateMonthIncrement_1.calculateMonthIncrement(momentFactory_1.MomentFactory.currentDate()));
        }
    }
    static createPaymentPlanFromDefendantFinancialStatement(claim, draft) {
        const response = claim.response;
        const frequency = response.paymentIntention.paymentOption === paymentOption_1.PaymentOption.INSTALMENTS ?
            frequency_1.Frequency.of(response.paymentIntention.repaymentPlan.paymentSchedule) : frequency_1.Frequency.WEEKLY;
        if (claim.claimData.defendant.isBusiness()) {
            return undefined;
        }
        if (response === undefined) {
            throw new Error('Claim does not have response attached');
        }
        if (response.statementOfMeans === undefined) {
            throw new Error(`Claim response does not have financial statement attached`);
        }
        const instalmentAmount = Math.min(draft.courtDetermination.disposableIncome / frequency.monthlyRatio, claim.totalAmountTillToday);
        if (instalmentAmount < 1) {
            return PaymentPlanHelper.createPaymentPlanFromStartDate(momentFactory_1.MomentFactory.maxDate());
        }
        return PaymentPlanHelper.createPaymentPlanFromInstallment(admissionHelper_1.AdmissionHelper.getAdmittedAmount(claim), instalmentAmount, frequency, calculateMonthIncrement_1.calculateMonthIncrement(momentFactory_1.MomentFactory.currentDate()));
    }
    static createPaymentPlanFromDraft(draft) {
        switch (draft.constructor) {
            case draftClaimantResponse_1.DraftClaimantResponse:
                return PaymentPlanHelper.createPaymentPlanFromDraftDraftClaimantResponse(draft);
            case responseDraft_1.ResponseDraft:
                throw new Error(`Draft object of type 'ResponseDraft' not yet supported`);
            default:
                throw new Error(`Incompatible draft object: ${draft}`);
        }
    }
    static createPaymentPlanFromForm(paymentPlanForm) {
        if (!paymentPlanForm) {
            return undefined;
        }
        return PaymentPlanHelper.createPaymentPlanFromInstallment(paymentPlanForm.totalAmount, paymentPlanForm.instalmentAmount, paymentPlanForm.paymentSchedule ? frequency_1.Frequency.of(paymentPlanForm.paymentSchedule.value) : undefined, paymentPlanForm.firstPaymentDate ? paymentPlanForm.firstPaymentDate.toMoment() : undefined);
    }
    static createPaymentPlanFromDraftDraftClaimantResponse(draft) {
        if (!draft) {
            return undefined;
        }
        return PaymentPlanHelper.createPaymentPlanFromDraftPaymentIntention(draft.alternatePaymentMethod);
    }
    static createPaymentPlanFromDraftPaymentIntention(paymentIntention) {
        const paymentPlan = paymentIntention.paymentPlan;
        if (!paymentPlan) {
            return undefined;
        }
        return PaymentPlanHelper.createPaymentPlanFromInstallment(paymentPlan.totalAmount, paymentPlan.instalmentAmount, paymentPlan.paymentSchedule ? frequency_1.Frequency.of(paymentPlan.paymentSchedule.value) : undefined, paymentPlan.firstPaymentDate ? paymentPlan.firstPaymentDate.toMoment() : undefined);
    }
    static createPaymentPlanFromInstallment(totalAmount, instalmentAmount, frequency, firstPaymentDate) {
        if (!totalAmount || !instalmentAmount || !frequency) {
            return undefined;
        }
        return paymentPlan_1.PaymentPlan.create(totalAmount, instalmentAmount, frequency, firstPaymentDate);
    }
    static createPaymentPlanFromStartDate(firstPaymentDate) {
        return paymentPlan_1.PaymentPlan.create(0, 0, frequency_1.Frequency.WEEKLY, firstPaymentDate);
    }
}
exports.PaymentPlanHelper = PaymentPlanHelper;
