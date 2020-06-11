"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frequency_1 = require("common/frequency/frequency");
class PaymentSchedule {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            PaymentSchedule.EACH_WEEK,
            PaymentSchedule.EVERY_TWO_WEEKS,
            PaymentSchedule.EVERY_MONTH
        ];
    }
    static of(value) {
        const result = PaymentSchedule.all().filter(item => item.value === value).pop();
        if (result) {
            return result;
        }
        throw new Error(`There is no PaymentSchedule: '${value}'`);
    }
    static toFrequency(value) {
        switch (value) {
            case 'EACH_WEEK': {
                return frequency_1.Frequency.WEEKLY;
            }
            case 'EVERY_TWO_WEEKS': {
                return frequency_1.Frequency.TWO_WEEKLY;
            }
            case 'EVERY_MONTH': {
                return frequency_1.Frequency.MONTHLY;
            }
        }
    }
}
exports.PaymentSchedule = PaymentSchedule;
PaymentSchedule.EACH_WEEK = new PaymentSchedule('EACH_WEEK', 'Each week');
PaymentSchedule.EVERY_TWO_WEEKS = new PaymentSchedule('EVERY_TWO_WEEKS', 'Every two weeks');
PaymentSchedule.EVERY_MONTH = new PaymentSchedule('EVERY_MONTH', 'Every month');
