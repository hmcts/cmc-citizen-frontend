"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const frequency_1 = require("common/frequency/frequency");
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
describe('Frequency', () => {
    describe('of', () => {
        [
            { frequencyValue: 'WEEK', expectedFrequency: frequency_1.Frequency.WEEKLY },
            { frequencyValue: 'EACH_WEEK', expectedFrequency: frequency_1.Frequency.WEEKLY },
            { frequencyValue: 'TWO_WEEKS', expectedFrequency: frequency_1.Frequency.TWO_WEEKLY },
            { frequencyValue: 'EVERY_TWO_WEEKS', expectedFrequency: frequency_1.Frequency.TWO_WEEKLY },
            { frequencyValue: 'FOUR_WEEKS', expectedFrequency: frequency_1.Frequency.FOUR_WEEKLY },
            { frequencyValue: 'EVERY_FOUR_WEEKS', expectedFrequency: frequency_1.Frequency.FOUR_WEEKLY },
            { frequencyValue: 'MONTH', expectedFrequency: frequency_1.Frequency.MONTHLY },
            { frequencyValue: 'EVERY_MONTH', expectedFrequency: frequency_1.Frequency.MONTHLY }
        ].forEach(testCase => {
            it(`should return Frequency object for valid value input: ${testCase.frequencyValue}`, () => {
                const frequency = frequency_1.Frequency.of(testCase.frequencyValue);
                chai_1.expect(frequency instanceof frequency_1.Frequency).to.equal(true);
                chai_1.expect(frequency).to.equal(testCase.expectedFrequency);
                chai_1.expect(frequency.monthlyRatio).to.equal(testCase.expectedFrequency.monthlyRatio);
            });
            it('should throw exception for invalid input', () => {
                try {
                    frequency_1.Frequency.of('unknown');
                }
                catch (e) {
                    chai_1.expect(e.message).to.equal(`There is no Frequency for value: 'unknown'`);
                }
            });
        });
        describe('ofWeekly', () => {
            [
                { frequencyWeeklyValue: 1, expectedFrequency: frequency_1.Frequency.WEEKLY },
                { frequencyWeeklyValue: 2, expectedFrequency: frequency_1.Frequency.TWO_WEEKLY },
                { frequencyWeeklyValue: 4, expectedFrequency: frequency_1.Frequency.FOUR_WEEKLY },
                { frequencyWeeklyValue: 52 / 12, expectedFrequency: frequency_1.Frequency.MONTHLY }
            ].forEach(testCase => {
                it(`should return Frequency object for valid weekly value input: ${testCase.frequencyWeeklyValue}`, () => {
                    const frequency = frequency_1.Frequency.ofWeekly(testCase.frequencyWeeklyValue);
                    chai_1.expect(frequency instanceof frequency_1.Frequency).to.equal(true);
                    chai_1.expect(frequency).to.equal(testCase.expectedFrequency);
                    chai_1.expect(frequency.monthlyRatio).to.equal(testCase.expectedFrequency.monthlyRatio);
                });
            });
            it('should throw exception for invalid input', () => {
                try {
                    frequency_1.Frequency.ofWeekly(0);
                }
                catch (e) {
                    chai_1.expect(e.message).to.equal(`There is no Frequency for weekly value: '0'`);
                }
            });
        });
        describe('toPaymentSchedule', () => {
            it('should pass when frequency is converted to paymentSchedule for EVERY_TWO_WEEKS', () => {
                chai_1.expect(frequency_1.Frequency.toPaymentSchedule(frequency_1.Frequency.of('EVERY_TWO_WEEKS'))).to.deep.equal(paymentSchedule_1.PaymentSchedule.EVERY_TWO_WEEKS);
            });
            it('should pass when frequency is converted to paymentSchedule for EACH_WEEK', () => {
                chai_1.expect(frequency_1.Frequency.toPaymentSchedule(frequency_1.Frequency.of('EACH_WEEK'))).to.deep.equal(paymentSchedule_1.PaymentSchedule.EACH_WEEK);
            });
            it('should pass when frequency is converted to paymentSchedule for EVERY_MONTH', () => {
                chai_1.expect(frequency_1.Frequency.toPaymentSchedule(frequency_1.Frequency.of('EVERY_MONTH'))).to.deep.equal(paymentSchedule_1.PaymentSchedule.EVERY_MONTH);
            });
        });
    });
});
