"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
describe('FormaliseRepaymentPlanOption', () => {
    describe('all', () => {
        it('should return an array', () => {
            const actual = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all();
            chai_1.expect(actual).instanceof(Array);
            chai_1.expect(actual.length).to.eq(3);
        });
    });
    describe('valueOf', () => {
        it('should return undefined when undefined given', () => {
            const actual = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.valueOf(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return undefined when unknown type given', () => {
            const actual = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.valueOf('I do not know this option!');
            chai_1.expect(actual).to.be.eq(undefined);
        });
        formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all().forEach(option => {
            it(`should return valid object for ${option.value}`, () => {
                const actual = formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.valueOf(option.value);
                chai_1.expect(actual).to.be.equal(option);
            });
        });
    });
});
