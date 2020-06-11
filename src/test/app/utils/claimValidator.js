"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("numeral/locales/en-gb");
const claimValidator_1 = require("utils/claimValidator");
describe('ClaimValidator.validateClaimAmount', () => {
    describe('should throws error for amount', () => {
        it('null', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(null)).to.throw(Error, 'Claim amount must be a valid numeric value');
        });
        it('undefined', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(undefined)).to.throw(Error, 'Claim amount must be a valid numeric value');
        });
        it('negative', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(-100)).to.throw(Error, 'Claim amount must be a valid numeric value');
        });
        it('grater than 10000', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(10001)).to.throw(Error, 'The total claim amount exceeds the stated limit of 10000');
        });
    });
    describe('should not throws error for amount', () => {
        it('equals to 0', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(0)).not.to.throw();
        });
        it('equals to 10000', () => {
            chai_1.expect(() => claimValidator_1.ClaimValidator.claimAmount(10000)).not.to.throw();
        });
    });
});
