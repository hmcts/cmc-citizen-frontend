"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const reviewOrder_1 = require("claims/models/reviewOrder");
const chai_1 = require("chai");
describe('Review Order', () => {
    describe('deserialize', () => {
        it('should return undefined when undefined input given', () => {
            const actual = new reviewOrder_1.ReviewOrder().deserialize(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
        it('should deserialize valid JSON to valid instance of Review Order object', () => {
            const input = {
                reason: 'some reason',
                requestedBy: 'CLAIMANT',
                requestedAt: momentFactory_1.MomentFactory.parse('2019-01-01').toISOString()
            };
            const reviewOrder = new reviewOrder_1.ReviewOrder().deserialize(input);
            chai_1.expect(reviewOrder).to.be.instanceOf(reviewOrder_1.ReviewOrder);
        });
    });
});
