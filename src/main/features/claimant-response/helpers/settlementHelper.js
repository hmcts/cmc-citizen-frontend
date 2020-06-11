"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settlement_1 = require("claims/models/settlement");
const partyStatement_1 = require("claims/models/partyStatement");
const paymentPlanHelper_1 = require("shared/helpers/paymentPlanHelper");
const offer_1 = require("claims/models/offer");
const statementType_1 = require("offer/form/models/statementType");
const madeBy_1 = require("claims/models/madeBy");
const momentFormatter_1 = require("utils/momentFormatter");
const numberFormatter_1 = require("utils/numberFormatter");
const payment_schedule_type_view_filter_1 = require("claimant-response/filters/payment-schedule-type-view-filter");
const amountHelper_1 = require("./amountHelper");
function getRepaymentPlanOrigin(settlement) {
    if (!settlement) {
        throw new Error('settlement must not be null');
    }
    const partyStatementSuggestingPaymentPlan = settlement.partyStatements.slice(-2)[0];
    if (!partyStatementSuggestingPaymentPlan) {
        throw new Error('partyStatement must not be null');
    }
    return partyStatementSuggestingPaymentPlan.madeBy;
}
exports.getRepaymentPlanOrigin = getRepaymentPlanOrigin;
function prepareSettlement(claim, draft) {
    if (draft.settlementAgreement && draft.settlementAgreement.signed) {
        const partyStatements = [prepareDefendantPartyStatement(claim, draft), acceptOffer()];
        return new settlement_1.Settlement(partyStatements);
    }
    throw new Error('SettlementAgreement should be signed by claimant');
}
exports.prepareSettlement = prepareSettlement;
function prepareDefendantPartyStatement(claim, draft) {
    const offer = prepareDefendantOffer(claim, draft);
    return new partyStatement_1.PartyStatement(statementType_1.StatementType.OFFER.value, madeBy_1.MadeBy.DEFENDANT.value, offer);
}
exports.prepareDefendantPartyStatement = prepareDefendantPartyStatement;
function prepareDefendantOffer(claim, draft) {
    const response = claim.response;
    const amount = numberFormatter_1.NumberFormatter.formatMoney(amountHelper_1.AmountHelper.calculateTotalAmount(claim, draft));
    if (response.paymentIntention.paymentDate) {
        const completionDate = response.paymentIntention.paymentDate;
        const content = `${response.defendant.name} will pay ${amount}, no later than ${momentFormatter_1.MomentFormatter.formatLongDate(completionDate)}`;
        return new offer_1.Offer(content, completionDate, response.paymentIntention);
    }
    else if (response.paymentIntention.repaymentPlan) {
        const paymentPlan = paymentPlanHelper_1.PaymentPlanHelper.createPaymentPlanFromClaim(claim, draft);
        const instalmentAmount = numberFormatter_1.NumberFormatter.formatMoney(paymentPlan.instalmentAmount);
        const paymentSchedule = payment_schedule_type_view_filter_1.PaymentScheduleTypeViewFilter.render(response.paymentIntention.repaymentPlan.paymentSchedule).toLowerCase();
        const firstPaymentDate = momentFormatter_1.MomentFormatter.formatLongDate(paymentPlan.startDate);
        const completionDate = paymentPlan.calculateLastPaymentDate();
        const content = `${response.defendant.name} will repay ${amount} in instalments of ${instalmentAmount} ${paymentSchedule}. The first instalment will be paid by ${firstPaymentDate}.`;
        return new offer_1.Offer(content, completionDate, response.paymentIntention);
    }
    throw new Error('Invalid paymentIntention');
}
exports.prepareDefendantOffer = prepareDefendantOffer;
function acceptOffer() {
    return new partyStatement_1.PartyStatement(statementType_1.StatementType.ACCEPTATION.value, madeBy_1.MadeBy.CLAIMANT.value);
}
exports.acceptOffer = acceptOffer;
