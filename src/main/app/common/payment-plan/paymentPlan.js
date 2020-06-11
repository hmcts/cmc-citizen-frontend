"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("moment-precise-range-plugin");
const momentFactory_1 = require("shared/momentFactory");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
const frequency_1 = require("common/frequency/frequency");
const frequencyConversions_1 = require("common/frequency/frequencyConversions");
class PaymentPlan {
    constructor(totalAmount, instalmentAmount, frequency, startDate) {
        this.totalAmount = totalAmount;
        this.instalmentAmount = instalmentAmount;
        this.frequency = frequency;
        this.startDate = startDate;
        this.numberOfInstalments = Math.ceil(totalAmount / instalmentAmount);
    }
    static create(totalAmount, instalmentAmount, frequency, startDate = momentFactory_1.MomentFactory.currentDate()) {
        return new PaymentPlan(totalAmount, instalmentAmount, frequency, startDate);
    }
    calculatePaymentLength() {
        const paymentLength = [];
        switch (this.frequency) {
            case (frequency_1.Frequency.WEEKLY):
                paymentLength.push(this.pluralize(this.numberOfInstalments, 'week'));
                break;
            case (frequency_1.Frequency.TWO_WEEKLY):
                paymentLength.push(this.pluralize(2 * this.numberOfInstalments, 'week'));
                break;
            default:
                paymentLength.push(this.pluralize(this.numberOfInstalments, 'month'));
        }
        return paymentLength.join(' ');
    }
    calculateLastPaymentDate() {
        let lastPaymentDate = this.startDate.clone();
        switch (this.frequency) {
            case (frequency_1.Frequency.WEEKLY):
                lastPaymentDate.add(this.numberOfInstalments - 1, 'weeks');
                break;
            case (frequency_1.Frequency.TWO_WEEKLY):
                lastPaymentDate.add((this.numberOfInstalments - 1) * 2, 'weeks');
                break;
            case (frequency_1.Frequency.MONTHLY):
                lastPaymentDate = calculateMonthIncrement_1.calculateMonthIncrement(lastPaymentDate, this.numberOfInstalments - 1);
                break;
        }
        return lastPaymentDate;
    }
    convertTo(frequency, startDate) {
        let monthlyInstalmentAmount;
        switch (frequency) {
            case frequency_1.Frequency.WEEKLY:
                monthlyInstalmentAmount = frequencyConversions_1.FrequencyConversions.convertAmountToWeekly(this.instalmentAmount, this.frequency);
                break;
            case frequency_1.Frequency.TWO_WEEKLY:
                monthlyInstalmentAmount = frequencyConversions_1.FrequencyConversions.convertAmountToTwoWeekly(this.instalmentAmount, this.frequency);
                break;
            case frequency_1.Frequency.FOUR_WEEKLY:
                monthlyInstalmentAmount = frequencyConversions_1.FrequencyConversions.convertAmountToFourWeekly(this.instalmentAmount, this.frequency);
                break;
            case frequency_1.Frequency.MONTHLY:
                monthlyInstalmentAmount = frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(this.instalmentAmount, this.frequency);
                break;
            default:
                throw new Error(`Incompatible Frequency: ${frequency}`);
        }
        const paymentPlanStartDate = startDate ? startDate : this.startDate;
        return PaymentPlan.create(this.totalAmount, monthlyInstalmentAmount, frequency, paymentPlanStartDate);
    }
    pluralize(num, word) {
        const plural = num < 2 ? '' : 's';
        return `${num} ${word}${plural}`;
    }
}
exports.PaymentPlan = PaymentPlan;
