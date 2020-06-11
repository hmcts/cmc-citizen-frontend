"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const baseRepaymentPlanData = {
    instalmentAmount: 100,
    firstPaymentDate: '2050-12-31T00:00:00.000',
    completionDate: '2052-12-31T00:00:00.000',
    paymentLength: '2 years'
};
exports.weeklyRepaymentPlanData = Object.assign(Object.assign({}, baseRepaymentPlanData), { paymentSchedule: paymentSchedule_1.PaymentSchedule.EACH_WEEK });
exports.twoWeeklyRepaymentPlanData = Object.assign(Object.assign({}, baseRepaymentPlanData), { paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_TWO_WEEKS });
exports.monthlyRepaymentPlanData = Object.assign(Object.assign({}, baseRepaymentPlanData), { paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH });
