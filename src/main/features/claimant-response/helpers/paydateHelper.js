"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const moment = require("moment");
const paymentOption_1 = require("claims/models/paymentOption");
function getEarliestPaymentDateForPaymentPlan(claim, claimantPaymentDate) {
    const monthIncrementDate = calculateMonthIncrement_1.calculateMonthIncrement(moment().startOf('day'));
    const response = claim.response;
    if (!response) {
        return monthIncrementDate;
    }
    const defendantPaymentOption = response.paymentIntention.paymentOption;
    const earliestPermittedDate = claimantPaymentDate < monthIncrementDate ? monthIncrementDate : claimantPaymentDate;
    if (defendantPaymentOption === paymentOption_1.PaymentOption.IMMEDIATELY || defendantPaymentOption === paymentOption_1.PaymentOption.BY_SPECIFIED_DATE) {
        return earliestPermittedDate;
    }
    const defendantPaymentDate = response.paymentIntention.repaymentPlan.firstPaymentDate;
    return defendantPaymentDate < earliestPermittedDate ? defendantPaymentDate : earliestPermittedDate;
}
exports.getEarliestPaymentDateForPaymentPlan = getEarliestPaymentDateForPaymentPlan;
