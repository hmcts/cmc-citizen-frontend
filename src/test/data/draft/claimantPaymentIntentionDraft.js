"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentOption_1 = require("main/common/components/payment-intention/model/paymentOption");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const paymentIntention_1 = require("main/common/components/payment-intention/model/paymentIntention");
exports.payImmediatelyIntent = paymentIntention_1.PaymentIntention.deserialize({
    paymentOption: {
        option: {
            value: paymentOption_1.PaymentType.IMMEDIATELY.value
        }
    }
});
exports.payBySetDateIntent = paymentIntention_1.PaymentIntention.deserialize({
    paymentOption: {
        option: {
            value: paymentOption_1.PaymentType.BY_SET_DATE.value
        }
    },
    paymentDate: {
        date: {
            year: 2018,
            month: 12,
            day: 31
        }
    }
});
exports.payByInstallmentsIntent = paymentIntention_1.PaymentIntention.deserialize({
    paymentOption: {
        option: {
            value: paymentOption_1.PaymentType.INSTALMENTS.value
        }
    },
    paymentPlan: {
        instalmentAmount: 100,
        paymentSchedule: {
            value: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value
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
});
