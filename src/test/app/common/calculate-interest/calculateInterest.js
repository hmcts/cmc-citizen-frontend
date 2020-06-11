"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const momentFactory_1 = require("shared/momentFactory");
const calculateInterest_1 = require("common/calculate-interest/calculateInterest");
const claim_store_1 = require("test/http-mocks/claim-store");
const hooks_1 = require("test/hooks");
describe('calculateInterest', () => {
    hooks_1.attachDefaultHooks();
    it(`should return 0 without calling an API when interest period is 0 days`, async () => {
        const interestFromDate = momentFactory_1.MomentFactory.currentDateTime();
        const interestToDate = momentFactory_1.MomentFactory.currentDateTime();
        const amount = await calculateInterest_1.calculateInterest(100, 8, interestFromDate, interestToDate);
        chai_1.expect(amount).to.equal(0);
    });
    it(`should return interest value calculated by API when interest period is greater then 0 days`, async () => {
        claim_store_1.mockCalculateInterestRate(0.08);
        const interestFromDate = momentFactory_1.MomentFactory.currentDateTime().subtract(1, 'year');
        const interestToDate = momentFactory_1.MomentFactory.currentDateTime();
        const amount = await calculateInterest_1.calculateInterest(100, 8, interestFromDate, interestToDate);
        chai_1.expect(amount).to.equal(0.08);
    });
});
