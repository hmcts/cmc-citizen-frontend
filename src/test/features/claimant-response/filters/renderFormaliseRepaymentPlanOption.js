"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const renderFormaliseRepaymentPlanOption_1 = require("claimant-response/filters/renderFormaliseRepaymentPlanOption");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
describe('Formalise repayment plan option filter', () => {
    formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(renderFormaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOptionFilter.render(type)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => renderFormaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOptionFilter.render(null)).to.throw(Error);
    });
});
