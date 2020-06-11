"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frequency_1 = require("common/frequency/frequency");
class FrequencyConversions {
    static convertAmountToMonthly(amount, frequency) {
        return amount * frequency.monthlyRatio;
    }
    static convertAmountToWeekly(amount, frequency) {
        return FrequencyConversions.convertAmountToMonthly(amount, frequency) / frequency_1.Frequency.WEEKLY.monthlyRatio;
    }
    static convertAmountToTwoWeekly(amount, frequency) {
        return FrequencyConversions.convertAmountToMonthly(amount, frequency) / frequency_1.Frequency.TWO_WEEKLY.monthlyRatio;
    }
    static convertAmountToFourWeekly(amount, frequency) {
        return FrequencyConversions.convertAmountToMonthly(amount, frequency) / frequency_1.Frequency.FOUR_WEEKLY.monthlyRatio;
    }
}
exports.FrequencyConversions = FrequencyConversions;
