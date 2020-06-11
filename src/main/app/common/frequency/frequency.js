"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const paymentFrequency_1 = require("claims/models/response/core/paymentFrequency");
class Frequency {
    constructor(values, monthlyRatio, inWeeks, displayValue) {
        this.values = values;
        this.monthlyRatio = monthlyRatio;
        this.inWeeks = inWeeks;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            Frequency.WEEKLY,
            Frequency.TWO_WEEKLY,
            Frequency.FOUR_WEEKLY,
            Frequency.MONTHLY
        ];
    }
    static of(value) {
        const matchByFrequencyValue = (frequencyValue) => frequencyValue === value;
        const filterByFrequencyValues = (frequency) => frequency.values.some(matchByFrequencyValue);
        const result = Frequency.all().filter(filterByFrequencyValues).pop();
        if (result) {
            return result;
        }
        throw new Error(`There is no Frequency for value: '${value}'`);
    }
    static ofWeekly(weeklyValue) {
        const filterByFrequencyWeeklyValue = (frequency) => frequency.inWeeks === weeklyValue;
        const result = Frequency.all().filter(filterByFrequencyWeeklyValue).pop();
        if (result) {
            return result;
        }
        throw new Error(`There is no Frequency for weekly value: '${weeklyValue}'`);
    }
    static toPaymentSchedule(frequency) {
        for (const value of frequency.values) {
            switch (value) {
                case paymentSchedule_1.PaymentSchedule.EACH_WEEK: {
                    return paymentSchedule_1.PaymentSchedule.EACH_WEEK;
                }
                case paymentSchedule_1.PaymentSchedule.EVERY_TWO_WEEKS: {
                    return paymentSchedule_1.PaymentSchedule.EVERY_TWO_WEEKS;
                }
                case paymentSchedule_1.PaymentSchedule.EVERY_MONTH: {
                    return paymentSchedule_1.PaymentSchedule.EVERY_MONTH;
                }
            }
        }
    }
    static toPaymentFrequency(frequency) {
        for (const value of frequency.values) {
            switch (value) {
                case paymentFrequency_1.PaymentFrequency.WEEK: {
                    return paymentFrequency_1.PaymentFrequency.WEEK;
                }
                case paymentFrequency_1.PaymentFrequency.TWO_WEEKS: {
                    return paymentFrequency_1.PaymentFrequency.TWO_WEEKS;
                }
                case paymentFrequency_1.PaymentFrequency.FOUR_WEEKS: {
                    return paymentFrequency_1.PaymentFrequency.FOUR_WEEKS;
                }
                case paymentFrequency_1.PaymentFrequency.MONTH: {
                    return paymentFrequency_1.PaymentFrequency.MONTH;
                }
            }
        }
    }
}
exports.Frequency = Frequency;
Frequency.WEEKLY = new Frequency(['WEEK', 'EACH_WEEK'], 52 / 12, 1, 'Each week');
Frequency.TWO_WEEKLY = new Frequency(['TWO_WEEKS', 'EVERY_TWO_WEEKS'], 52 / 12 / 2, 2, 'Every 2 weeks');
Frequency.FOUR_WEEKLY = new Frequency(['FOUR_WEEKS', 'EVERY_FOUR_WEEKS'], 52 / 12 / 4, 4, 'Every 4 weeks');
Frequency.MONTHLY = new Frequency(['MONTH', 'EVERY_MONTH'], 1, 52 / 12, 'Every month');
