"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frequency_1 = require("common/frequency/frequency");
var FrequencyViewFilter;
(function (FrequencyViewFilter) {
    function render(frequency) {
        return frequency.displayValue;
    }
    FrequencyViewFilter.render = render;
    function renderPaymentFrequency(paymentFrequency) {
        return frequency_1.Frequency.of(paymentFrequency.toString()).displayValue;
    }
    FrequencyViewFilter.renderPaymentFrequency = renderPaymentFrequency;
})(FrequencyViewFilter = exports.FrequencyViewFilter || (exports.FrequencyViewFilter = {}));
