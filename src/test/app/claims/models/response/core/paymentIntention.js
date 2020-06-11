"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const rawObjectUtils_1 = require("test/rawObjectUtils");
const paymentIntention_1 = require("claims/models/response/core/paymentIntention");
const paymentIntentionData_1 = require("test/data/entity/paymentIntentionData");
describe('PaymentIntention', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = paymentIntention_1.PaymentIntention.deserialize(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        const tests = [
            { type: 'immediatly', data: paymentIntentionData_1.immediatelyPaymentIntentionData },
            { type: 'set date', data: paymentIntentionData_1.bySetDatePaymentIntentionData },
            { type: 'weekly instalment', data: paymentIntentionData_1.weeklyInstalmentPaymentIntentionData },
            { type: 'two weekly instament', data: paymentIntentionData_1.twoWeeklyInstalmentPaymentIntentionData },
            { type: 'monthly instament', data: paymentIntentionData_1.monthlyInstalmentPaymentIntentionData }
        ];
        tests.forEach(test => it(`should deserialize valid JSON of type '${test.type}' to valid PaymentIntention object`, () => {
            const actual = paymentIntention_1.PaymentIntention.deserialize(test.data);
            chai_1.expect(rawObjectUtils_1.convertToRawObject(actual)).to.be.deep.equal(test.data);
        }));
    });
});
