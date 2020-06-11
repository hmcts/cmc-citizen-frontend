"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const frequencyConversions_1 = require("common/frequency/frequencyConversions");
const frequency_1 = require("common/frequency/frequency");
describe('CalculateAmountByFrequency', () => {
    describe('convertAmountToMonthly', () => {
        describe('when a weekly amount is given', () => {
            it('should calculate the monthly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(100, frequency_1.Frequency.WEEKLY)).to.equal(433.3333333333333);
            });
        });
        describe('when a two-weekly amount is given', () => {
            it('should calculate the monthly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(100, frequency_1.Frequency.TWO_WEEKLY)).to.equal(216.66666666666666);
            });
        });
        describe('when a four-weekly amount is given', () => {
            it('should calculate the monthly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(100, frequency_1.Frequency.FOUR_WEEKLY)).to.equal(108.33333333333333);
            });
        });
        describe('when a monthly amount is given', () => {
            it('should calculate the monthly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToMonthly(100, frequency_1.Frequency.MONTHLY)).to.equal(100);
            });
        });
    });
    describe('convertAmountToWeekly', () => {
        describe('when a weekly amount is given', () => {
            it('should calculate the weekly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToWeekly(100, frequency_1.Frequency.WEEKLY)).to.equal(100);
            });
        });
        describe('when a two-weekly amount is given', () => {
            it('should calculate the weekly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToWeekly(100, frequency_1.Frequency.TWO_WEEKLY)).to.equal(50);
            });
        });
        describe('when a four-weekly amount is given', () => {
            it('should calculate the weekly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToWeekly(100, frequency_1.Frequency.FOUR_WEEKLY)).to.equal(25);
            });
        });
        describe('when a monthly amount is given', () => {
            it('should calculate the weekly amount', () => {
                chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToWeekly(100, frequency_1.Frequency.MONTHLY)).to.equal(23.07692307692308);
            });
        });
        describe('convertAmountToTwoWeekly', () => {
            describe('when a weekly amount is given', () => {
                it('should calculate the two-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToTwoWeekly(100, frequency_1.Frequency.WEEKLY)).to.equal(200);
                });
            });
            describe('when a two-weekly amount is given', () => {
                it('should calculate the two-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToTwoWeekly(100, frequency_1.Frequency.TWO_WEEKLY)).to.equal(100);
                });
            });
            describe('when a four-weekly amount is given', () => {
                it('should calculate the two-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToTwoWeekly(100, frequency_1.Frequency.FOUR_WEEKLY)).to.equal(50);
                });
            });
            describe('when a monthly amount is given', () => {
                it('should calculate the two-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToTwoWeekly(100, frequency_1.Frequency.MONTHLY)).to.equal(46.15384615384616);
                });
            });
        });
        describe('convertAmountToFourWeekly', () => {
            describe('when a weekly amount is given', () => {
                it('should calculate the four-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToFourWeekly(100, frequency_1.Frequency.WEEKLY)).to.equal(400);
                });
            });
            describe('when a two-weekly amount is given', () => {
                it('should calculate the four-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToFourWeekly(100, frequency_1.Frequency.TWO_WEEKLY)).to.equal(200);
                });
            });
            describe('when a four-weekly amount is given', () => {
                it('should calculate the four-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToFourWeekly(100, frequency_1.Frequency.FOUR_WEEKLY)).to.equal(100);
                });
            });
            describe('when a monthly amount is given', () => {
                it('should calculate the four-weekly amount', () => {
                    chai_1.expect(frequencyConversions_1.FrequencyConversions.convertAmountToFourWeekly(100, frequency_1.Frequency.MONTHLY)).to.equal(92.30769230769232);
                });
            });
        });
    });
});
