"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frequency_1 = require("common/frequency/frequency");
const chai_1 = require("chai");
const frequency_view_filter_1 = require("claimant-response/filters/frequency-view-filter");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
describe('Frequency view filter', () => {
    context('render frequency', () => {
        frequency_1.Frequency.all()
            .forEach(frequency => {
            it(`should render ${frequency} as ${frequency.displayValue}`, () => {
                chai_1.expect(frequency_view_filter_1.FrequencyViewFilter.render(frequency)).to.equal(frequency.displayValue);
            });
        });
        it('should throw an error for null', () => {
            chai_1.expect(() => frequency_view_filter_1.FrequencyViewFilter.render(null)).to.throw(TypeError);
        });
    });
    context('render payment frequency', () => {
        it(`should render payment frequency ${paymentFrequency_1.PaymentFrequency.WEEK} as ${frequency_1.Frequency.WEEKLY.displayValue}`, () => {
            chai_1.expect(frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency(frequency_1.Frequency.toPaymentFrequency(frequency_1.Frequency.of(paymentFrequency_1.PaymentFrequency.WEEK)))).to.equal(frequency_1.Frequency.WEEKLY.displayValue);
        });
        it(`should render payment frequency ${paymentFrequency_1.PaymentFrequency.TWO_WEEKS} as ${frequency_1.Frequency.TWO_WEEKLY.displayValue}`, () => {
            chai_1.expect(frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency(frequency_1.Frequency.toPaymentFrequency(frequency_1.Frequency.of(paymentFrequency_1.PaymentFrequency.TWO_WEEKS)))).to.equal(frequency_1.Frequency.TWO_WEEKLY.displayValue);
        });
        it(`should render payment frequency ${paymentFrequency_1.PaymentFrequency.FOUR_WEEKS} as ${frequency_1.Frequency.FOUR_WEEKLY.displayValue}`, () => {
            chai_1.expect(frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency(frequency_1.Frequency.toPaymentFrequency(frequency_1.Frequency.of(paymentFrequency_1.PaymentFrequency.FOUR_WEEKS)))).to.equal(frequency_1.Frequency.FOUR_WEEKLY.displayValue);
        });
        it(`should render payment frequency ${paymentFrequency_1.PaymentFrequency.MONTH} as ${frequency_1.Frequency.MONTHLY.displayValue}`, () => {
            chai_1.expect(frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency(frequency_1.Frequency.toPaymentFrequency(frequency_1.Frequency.of(paymentFrequency_1.PaymentFrequency.MONTH)))).to.equal(frequency_1.Frequency.MONTHLY.displayValue);
        });
        it('should throw an error for null', () => {
            chai_1.expect(() => frequency_view_filter_1.FrequencyViewFilter.renderPaymentFrequency(null)).to.throw(TypeError);
        });
    });
});
