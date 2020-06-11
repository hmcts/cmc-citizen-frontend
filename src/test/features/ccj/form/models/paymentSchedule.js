"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const paymentSchedule_2 = require("claims/models/response/core/paymentSchedule");
const frequency_1 = require("common/frequency/frequency");
describe('PaymentSchedule', () => {
    describe('of', () => {
        it('should return valid object for valid input', () => {
            const paymentSchedule = paymentSchedule_1.PaymentSchedule.of(paymentSchedule_1.PaymentSchedule.EACH_WEEK.value);
            chai_1.expect(paymentSchedule instanceof paymentSchedule_1.PaymentSchedule).to.equal(true);
            chai_1.expect(paymentSchedule.value).to.equal(paymentSchedule_1.PaymentSchedule.EACH_WEEK.value);
            chai_1.expect(paymentSchedule.displayValue).to.equal(paymentSchedule_1.PaymentSchedule.EACH_WEEK.displayValue);
        });
        it('should throw exception for invalid input', () => {
            try {
                paymentSchedule_1.PaymentSchedule.of('unknown');
            }
            catch (e) {
                chai_1.expect(e.message).to.equal(`There is no PaymentSchedule: 'unknown'`);
            }
        });
        it('should return correct frequency for payment schedule', () => {
            chai_1.expect(paymentSchedule_1.PaymentSchedule.toFrequency(paymentSchedule_2.PaymentSchedule.EACH_WEEK)).to.equal(frequency_1.Frequency.WEEKLY);
            chai_1.expect(paymentSchedule_1.PaymentSchedule.toFrequency(paymentSchedule_2.PaymentSchedule.EVERY_TWO_WEEKS)).to.equal(frequency_1.Frequency.TWO_WEEKLY);
            chai_1.expect(paymentSchedule_1.PaymentSchedule.toFrequency(paymentSchedule_2.PaymentSchedule.EVERY_MONTH)).to.equal(frequency_1.Frequency.MONTHLY);
        });
    });
});
