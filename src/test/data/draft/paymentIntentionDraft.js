"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const paymentOption_1 = require("claims/models/paymentOption");
exports.intentionOfImmediatePayment = {
    paymentOption: paymentOption_1.PaymentOption.IMMEDIATELY
};
exports.intentionOfPaymentInFullBySetDate = {
    paymentOption: paymentOption_1.PaymentOption.BY_SPECIFIED_DATE,
    paymentDate: momentFactory_1.MomentFactory.parse('2018-12-31')
};
exports.intentionOfPaymentByInstalments = {
    paymentOption: paymentOption_1.PaymentOption.INSTALMENTS,
    repaymentPlan: {
        instalmentAmount: 100,
        firstPaymentDate: momentFactory_1.MomentFactory.parse('2018-12-31'),
        paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH,
        completionDate: momentFactory_1.MomentFactory.parse('2019-12-30'),
        paymentLength: ''
    }
};
