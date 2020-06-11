"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const repaymentPlan_1 = require("claims/models/repaymentPlan");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
describe('RepaymentPlan', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = new repaymentPlan_1.RepaymentPlan().deserialize(undefined);
            chai_1.expect(actual.paymentSchedule).to.be.eq(undefined);
        });
        it('should deserialize valid JSON to valid instance of RepaymentPlan object', () => {
            const actual = new repaymentPlan_1.RepaymentPlan().deserialize({
                instalmentAmount: 50,
                firstPaymentDate: { year: 2018, month: 10, day: 10 },
                paymentSchedule: paymentSchedule_1.PaymentSchedule.EVERY_MONTH.value
            });
            chai_1.expect(actual).to.be.instanceof(repaymentPlan_1.RepaymentPlan);
        });
    });
});
