"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const chooseHowToProceedTask_1 = require("claimant-response/tasks/chooseHowToProceedTask");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
describe('ChooseHowToProceedTask', () => {
    it('should not be completed when object is undefined', () => {
        chai_1.expect(chooseHowToProceedTask_1.ChooseHowToProceedTask.isCompleted(undefined)).to.be.false;
    });
    it('should not be completed when option is not selected', () => {
        chai_1.expect(chooseHowToProceedTask_1.ChooseHowToProceedTask.isCompleted(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(undefined))).to.be.false;
    });
    it('should be completed when option is selected', () => {
        formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all().forEach(option => {
            chai_1.expect(chooseHowToProceedTask_1.ChooseHowToProceedTask.isCompleted(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(option))).to.be.true;
        });
    });
});
