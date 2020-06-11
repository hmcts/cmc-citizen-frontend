"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const monthly_amount_view_filter_1 = require("claimant-response/filters/monthly-amount-view-filter");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
const errorMessage = 'Must be a valid FrequencyBasedAmount';
describe('Monthly amount view filter', () => {
    context('should throw error when', () => {
        it('is null', () => {
            chai_1.expect(() => monthly_amount_view_filter_1.MonthlyAmountViewFilter.render(null)).to.throw(errorMessage);
        });
        it('is undefined', () => {
            chai_1.expect(() => monthly_amount_view_filter_1.MonthlyAmountViewFilter.render(undefined)).to.throw(errorMessage);
        });
        it('has no amount', () => {
            chai_1.expect(() => monthly_amount_view_filter_1.MonthlyAmountViewFilter.render({
                frequency: paymentFrequency_1.PaymentFrequency.MONTH,
                amount: undefined
            })).to.throw(errorMessage);
        });
        it('has no frequency', () => {
            chai_1.expect(() => monthly_amount_view_filter_1.MonthlyAmountViewFilter.render({
                frequency: undefined,
                amount: 100
            })).to.throw(errorMessage);
        });
        it('has negative amount', () => {
            chai_1.expect(() => monthly_amount_view_filter_1.MonthlyAmountViewFilter.render({
                frequency: paymentFrequency_1.PaymentFrequency.FOUR_WEEKS,
                amount: -1
            })).to.throw(errorMessage);
        });
    });
    context('with valid data', () => {
        function test(frequency, inputAmount, expectedAmount) {
            const actualAmount = monthly_amount_view_filter_1.MonthlyAmountViewFilter.render({
                frequency: frequency,
                amount: inputAmount
            });
            const roundedAmount = +actualAmount.toFixed(2);
            chai_1.expect(roundedAmount).to.equal(expectedAmount);
        }
        it('should return same amount for monthly frequency', () => {
            test(paymentFrequency_1.PaymentFrequency.MONTH, 123.45, 123.45);
        });
        it('should convert four-weekly frequency', () => {
            test(paymentFrequency_1.PaymentFrequency.FOUR_WEEKS, 123.45, 133.74);
        });
        it('should convert two-weekly frequency', () => {
            test(paymentFrequency_1.PaymentFrequency.TWO_WEEKS, 123.45, 267.47);
        });
        it('should convert weekly frequency', () => {
            test(paymentFrequency_1.PaymentFrequency.WEEK, 123.45, 534.95);
        });
        it('should accept zero amount', () => {
            test(paymentFrequency_1.PaymentFrequency.MONTH, 0, 0);
        });
    });
});
