"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
class PaymentIntention {
    static deserialize(input) {
        if (!input) {
            return input;
        }
        const instance = new PaymentIntention();
        instance.paymentOption = input.paymentOption;
        instance.paymentDate = input.paymentDate && momentFactory_1.MomentFactory.parse(input.paymentDate);
        instance.repaymentPlan = input.repaymentPlan && {
            instalmentAmount: input.repaymentPlan.instalmentAmount,
            firstPaymentDate: momentFactory_1.MomentFactory.parse(input.repaymentPlan.firstPaymentDate),
            paymentSchedule: input.repaymentPlan.paymentSchedule,
            completionDate: input.repaymentPlan.completionDate && momentFactory_1.MomentFactory.parse(input.repaymentPlan.completionDate),
            paymentLength: input.repaymentPlan.paymentLength
        };
        return instance;
    }
    static retrievePaymentIntention(ccjRepaymentPlan, claim) {
        return {
            repaymentPlan: ccjRepaymentPlan && {
                instalmentAmount: ccjRepaymentPlan.instalmentAmount,
                firstPaymentDate: ccjRepaymentPlan.firstPaymentDate,
                paymentSchedule: ccjRepaymentPlan.paymentSchedule.value,
                completionDate: ccjRepaymentPlan.completionDate,
                paymentLength: ccjRepaymentPlan.paymentLength
            },
            paymentDate: claim.countyCourtJudgment.payBySetDate,
            paymentOption: claim.countyCourtJudgment.paymentOption
        };
    }
}
exports.PaymentIntention = PaymentIntention;
