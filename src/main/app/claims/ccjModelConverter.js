"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yesNoOption_1 = require("ccj/form/models/yesNoOption");
const repaymentPlan_1 = require("ccj/form/models/repaymentPlan");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const repaymentPlan_2 = require("claims/models/repaymentPlan");
const countyCourtJudgment_1 = require("claims/models/countyCourtJudgment");
const statementOfTruth_1 = require("claims/models/statementOfTruth");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
function convertRepaymentPlan(repaymentPlan) {
    if (repaymentPlan && repaymentPlan.remainingAmount) {
        return new repaymentPlan_2.RepaymentPlan(repaymentPlan.instalmentAmount, repaymentPlan.firstPaymentDate.toMoment(), repaymentPlan.paymentSchedule.value);
    }
    return undefined;
}
function convertPaidAmount(draftCcj) {
    if (draftCcj.paidAmount.option && draftCcj.paidAmount.option.value === yesNoOption_1.PaidAmountOption.YES.value) {
        return draftCcj.paidAmount.amount;
    }
    return undefined;
}
function convertPayBySetDate(draftCcj) {
    return (draftCcj.paymentOption.option === ccjPaymentOption_1.PaymentType.BY_SPECIFIED_DATE)
        ? draftCcj.payBySetDate.date.toMoment() : undefined;
}
function retrievePaymentOptionsFromClaim(claim) {
    if (!claim.response || !claim.isAdmissionsResponse()) {
        return undefined;
    }
    else if (claim.isSettlementRejectedOrBreached()) {
        const lastOffer = claim.settlement.getLastOffer();
        if (lastOffer && lastOffer.paymentIntention) {
            const paymentOptionFromOffer = lastOffer.paymentIntention.paymentOption;
            return new ccjPaymentOption_1.CCJPaymentOption(ccjPaymentOption_1.PaymentType.valueOf(paymentOptionFromOffer));
        }
    }
    else {
        return undefined;
    }
}
exports.retrievePaymentOptionsFromClaim = retrievePaymentOptionsFromClaim;
function getRepaymentPlanForm(claim, draft) {
    if (draft.document.paymentOption.option === ccjPaymentOption_1.PaymentType.INSTALMENTS) {
        if ((claim.settlement && (claim.settlementReachedAt || claim.settlement.isOfferRejectedByDefendant())) || claim.hasDefendantNotSignedSettlementAgreementInTime()) {
            const coreRepaymentPlan = claim.settlement.getLastOffer().paymentIntention.repaymentPlan;
            const firstPaymentDate = calculateMonthIncrement_1.calculateMonthIncrement(momentFactory_1.MomentFactory.currentDate(), 1);
            const paymentSchedule = paymentSchedule_1.PaymentSchedule.of(coreRepaymentPlan.paymentSchedule);
            const alreadyPaid = (draft.document.paidAmount.amount || 0);
            const remainingAmount = claim.totalAmountTillToday - alreadyPaid;
            const repaymentPlanForm = new repaymentPlan_1.RepaymentPlan(remainingAmount, coreRepaymentPlan.instalmentAmount, new localDate_1.LocalDate(firstPaymentDate.year(), firstPaymentDate.month() + 1, firstPaymentDate.date()), paymentSchedule);
            return repaymentPlanForm;
        }
    }
    return draft.document.repaymentPlan;
}
exports.getRepaymentPlanForm = getRepaymentPlanForm;
class CCJModelConverter {
    static convertForRequest(draft, claim) {
        let statementOfTruth = undefined;
        if (draft.qualifiedDeclaration) {
            // API model is called statement of truth
            statementOfTruth = new statementOfTruth_1.StatementOfTruth(draft.qualifiedDeclaration.signerName, draft.qualifiedDeclaration.signerRole);
        }
        let ccjType;
        if (!draft.paymentOption.option) {
            throw new Error('payment option cannot be undefined');
        }
        const paymentOption = draft.paymentOption.option.value;
        if (claim.response && claim.isAdmissionsResponse()) {
            ccjType = countyCourtJudgmentType_1.CountyCourtJudgmentType.ADMISSIONS;
        }
        else {
            ccjType = countyCourtJudgmentType_1.CountyCourtJudgmentType.DEFAULT;
        }
        const defendantDateOfBirth = draft.defendantDateOfBirth.known ? draft.defendantDateOfBirth.date.toMoment() : undefined;
        return new countyCourtJudgment_1.CountyCourtJudgment(defendantDateOfBirth, paymentOption, convertPaidAmount(draft), convertRepaymentPlan(draft.repaymentPlan), convertPayBySetDate(draft), statementOfTruth, ccjType);
    }
}
exports.CCJModelConverter = CCJModelConverter;
