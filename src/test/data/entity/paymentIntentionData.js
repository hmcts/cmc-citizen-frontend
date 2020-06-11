"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentOption_1 = require("claims/models/paymentOption");
const repaymentPlanData_1 = require("test/data/entity/repaymentPlanData");
exports.immediatelyPaymentIntentionData = {
    paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY
};
exports.bySetDatePaymentIntentionData = {
    paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: '2050-12-31T00:00:00.000'
};
const baseInstalmentPaymentIntentionData = {
    paymentOption: paymentOption_1.PaymentOption.INSTALMENTS
};
exports.weeklyInstalmentPaymentIntentionData = Object.assign(Object.assign({}, baseInstalmentPaymentIntentionData), { repaymentPlan: repaymentPlanData_1.weeklyRepaymentPlanData });
exports.twoWeeklyInstalmentPaymentIntentionData = Object.assign(Object.assign({}, baseInstalmentPaymentIntentionData), { repaymentPlan: repaymentPlanData_1.twoWeeklyRepaymentPlanData });
exports.monthlyInstalmentPaymentIntentionData = Object.assign(Object.assign({}, baseInstalmentPaymentIntentionData), { repaymentPlan: repaymentPlanData_1.monthlyRepaymentPlanData });
