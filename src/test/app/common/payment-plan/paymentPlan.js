"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const paymentPlan_1 = require("common/payment-plan/paymentPlan");
const frequency_1 = require("common/frequency/frequency");
const chai_1 = require("chai");
const moment = require("moment");
const momentFactory_1 = require("shared/momentFactory");
const TOTAL_AMOUNT = 20;
const TOTAL_AMOUNT_2 = 1643.20;
const TOTAL_AMOUNT_3 = 1000;
const frequencies = ['WEEK', 'TWO_WEEKS', 'MONTH'];
const TESTS = [
    {
        desc: 'should return the correct payment plan length with installment amount < 1£',
        claimAmount: TOTAL_AMOUNT,
        instalmentAmount: 0.50,
        expected: { WEEK: '40 weeks', TWO_WEEKS: '80 weeks', MONTH: '40 months' }
    },
    {
        desc: 'should return a payment plan length equal to the total amount if the installment amount is 1£',
        claimAmount: TOTAL_AMOUNT,
        instalmentAmount: 1,
        expected: { WEEK: TOTAL_AMOUNT + ' weeks', TWO_WEEKS: TOTAL_AMOUNT * 2 + ' weeks', MONTH: TOTAL_AMOUNT + ' months' }
    },
    {
        desc: 'should return the correct payment plan length with an installment amount with 1 decimal',
        claimAmount: TOTAL_AMOUNT,
        instalmentAmount: 2.5,
        expected: { WEEK: '8 weeks', TWO_WEEKS: '16 weeks', MONTH: '8 months' }
    },
    {
        desc: 'should return the correct payment plan length with an installment amount with 2 decimal',
        claimAmount: TOTAL_AMOUNT,
        instalmentAmount: 9.99,
        expected: { WEEK: '3 weeks', TWO_WEEKS: '6 weeks', MONTH: '3 months' }
    },
    {
        desc: 'should return the correct payment plan length with an installment amount with > 2 decimal',
        claimAmount: TOTAL_AMOUNT,
        instalmentAmount: 6.666,
        expected: { WEEK: '4 weeks', TWO_WEEKS: '8 weeks', MONTH: '4 months' }
    },
    {
        desc: 'should return a payment length of 1 period when paying full amount',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3,
        expected: { WEEK: '1 week', TWO_WEEKS: '2 weeks', MONTH: '1 month' }
    },
    {
        desc: 'should return a payment length of 1 period when paying in amounts greater than the amount claimed',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3 + 10,
        expected: { WEEK: '1 week', TWO_WEEKS: '2 weeks', MONTH: '1 month' }
    },
    {
        desc: 'should return a payment length of 10 months when paying one tenth of full amount',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3 / 10,
        expected: { WEEK: '10 weeks', TWO_WEEKS: '20 weeks', MONTH: '10 months' }
    },
    {
        desc: 'should return a payment length of 11 months where the last one is partial',
        claimAmount: TOTAL_AMOUNT_2,
        instalmentAmount: 150,
        expected: { WEEK: '11 weeks', TWO_WEEKS: '22 weeks', MONTH: '11 months' }
    }
];
frequencies.forEach(frequency => {
    describe(`when the frequency is ${frequency}`, () => {
        TESTS.forEach(test => {
            it(test.desc, () => {
                const paymentPlan = paymentPlan_1.PaymentPlan.create(test.claimAmount, test.instalmentAmount, frequency_1.Frequency.of(frequency));
                chai_1.expect(paymentPlan.calculatePaymentLength()).to.equal(test.expected[frequency]);
            });
        });
    });
});
const TESTS_FOR_LAST_PAYMENT_DATE = [
    {
        desc: 'should return a final payment date',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3,
        fromDate: moment('2019-01-01'),
        expected: { WEEK: moment('2019-01-01'), TWO_WEEKS: moment('2019-01-01'), MONTH: moment('2019-01-01') }
    },
    {
        desc: 'should return a final payment date',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3 / 2,
        fromDate: moment('2019-01-30'),
        expected: { WEEK: moment('2019-02-06'), TWO_WEEKS: moment('2019-02-13'), MONTH: moment('2019-03-01') }
    },
    {
        desc: 'should return a final payment date',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3 / 4,
        fromDate: moment('2019-01-31'),
        expected: { WEEK: moment('2019-02-21'), TWO_WEEKS: moment('2019-03-14'), MONTH: moment('2019-05-01') }
    },
    {
        desc: 'should return a final payment date',
        claimAmount: TOTAL_AMOUNT_3,
        instalmentAmount: TOTAL_AMOUNT_3 / 13,
        fromDate: moment('2020-02-29'),
        expected: { WEEK: moment('2020-05-23'), TWO_WEEKS: moment('2020-08-15'), MONTH: moment('2021-03-01') }
    }
];
describe('PaymentPlan', () => {
    describe('calculateLastPaymentDate', () => {
        frequencies.forEach(frequency => {
            describe(`when frequency is ${frequency}`, () => {
                TESTS_FOR_LAST_PAYMENT_DATE.forEach(test => {
                    it(`${test.desc} ${test.claimAmount / test.instalmentAmount} installments in the future
        starting from ${test.fromDate.format('YYYY-MM-DD')}`, () => {
                        const paymentPlan = paymentPlan_1.PaymentPlan.create(test.claimAmount, test.instalmentAmount, frequency_1.Frequency.of(frequency), test.fromDate);
                        chai_1.expect(paymentPlan.calculateLastPaymentDate().format('YYYY-MM-DD'))
                            .to.equal(momentFactory_1.MomentFactory.parse(test.expected[frequency]).format('YYYY-MM-DD'));
                    });
                });
            });
        });
        it('should return the last payment date from given start date', () => {
            const instalmentAmount = 10;
            const fromDate = moment('2018-01-01');
            const numberOfInstalmentsInWeeks = 100;
            const expectedLastPaymentDate = fromDate.clone().add(numberOfInstalmentsInWeeks - 1, 'weeks');
            const paymentPlan = paymentPlan_1.PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, frequency_1.Frequency.WEEKLY, fromDate);
            chai_1.expect(paymentPlan.calculateLastPaymentDate().isSame(expectedLastPaymentDate)).to.be.true;
        });
    });
    describe('convertTo', () => {
        it('should return the payment plan converted to weekly frequency', () => {
            const instalmentAmount = 100;
            const paymentPlan = paymentPlan_1.PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, frequency_1.Frequency.TWO_WEEKLY);
            const convertedPaymentPlan = paymentPlan.convertTo(frequency_1.Frequency.WEEKLY);
            chai_1.expect(convertedPaymentPlan.instalmentAmount).to.equal(50);
            chai_1.expect(convertedPaymentPlan.frequency).to.equal(frequency_1.Frequency.WEEKLY);
        });
        it('should return the payment plan converted to two-weekly frequency', () => {
            const instalmentAmount = 100;
            const paymentPlan = paymentPlan_1.PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, frequency_1.Frequency.WEEKLY);
            const convertedPaymentPlan = paymentPlan.convertTo(frequency_1.Frequency.TWO_WEEKLY);
            chai_1.expect(convertedPaymentPlan.instalmentAmount).to.equal(200);
            chai_1.expect(convertedPaymentPlan.frequency).to.equal(frequency_1.Frequency.TWO_WEEKLY);
        });
        it('should return the payment plan converted to four-weekly frequency', () => {
            const instalmentAmount = 100;
            const paymentPlan = paymentPlan_1.PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, frequency_1.Frequency.WEEKLY);
            const convertedPaymentPlan = paymentPlan.convertTo(frequency_1.Frequency.FOUR_WEEKLY);
            chai_1.expect(convertedPaymentPlan.instalmentAmount).to.equal(400);
            chai_1.expect(convertedPaymentPlan.frequency).to.equal(frequency_1.Frequency.FOUR_WEEKLY);
        });
        it('should return the payment plan converted to monthly frequency', () => {
            const instalmentAmount = 100;
            const paymentPlan = paymentPlan_1.PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, frequency_1.Frequency.WEEKLY);
            const convertedPaymentPlan = paymentPlan.convertTo(frequency_1.Frequency.MONTHLY);
            chai_1.expect(convertedPaymentPlan.instalmentAmount).to.equal(433.3333333333333);
            chai_1.expect(convertedPaymentPlan.frequency).to.equal(frequency_1.Frequency.MONTHLY);
        });
    });
});
