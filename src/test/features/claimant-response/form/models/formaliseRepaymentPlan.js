"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const formaliseRepaymentPlan_1 = require("claimant-response/form/models/formaliseRepaymentPlan");
const formaliseRepaymentPlanOption_1 = require("claimant-response/form/models/formaliseRepaymentPlanOption");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('FormaliseRepaymentPlan', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined option', () => {
            const errors = validator.validateSync(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
        });
        it('should reject with invalid value', () => {
            const errors = validator.validateSync(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(new formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption('invalid', 'value')));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
        });
        it('should accept formaliseRepaymentPlan with recognised type', () => {
            formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.all().forEach(option => {
                const errors = validator.validateSync(option);
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject(undefined)).to.deep.equal(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject()).to.deep.equal(undefined);
        });
        it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
            chai_1.expect(formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject({})).to.deep.equal(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(undefined));
        });
        it('should return a new instance with defaults when amount and schedule are invalid', () => {
            chai_1.expect(formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject({ 'option': 'INVALID' })).to.deep.equal(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(undefined));
        });
        it('should return a new instance initialised with set field from object parameter provided', () => {
            chai_1.expect(formaliseRepaymentPlan_1.FormaliseRepaymentPlan.fromObject({ option: formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT.value })).to.deep.equal(new formaliseRepaymentPlan_1.FormaliseRepaymentPlan(formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT));
        });
    });
    describe('deserialize', () => {
        it('should return an FormaliseRepaymentPlan instance', () => {
            const deserialized = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(formaliseRepaymentPlan_1.FormaliseRepaymentPlan);
        });
        it('should return a FormaliseRepaymentPlan instance with fields set to default values when given "undefined"', () => {
            const deserialized = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan().deserialize(undefined);
            chai_1.expect(deserialized.option).to.be.equal(undefined);
        });
        it('should return a FormaliseRepaymentPlan instance with fields set to default values when given "null"', () => {
            const deserialized = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan().deserialize(null);
            chai_1.expect(deserialized.option).to.be.equal(undefined);
        });
        it('should return a FormaliseRepaymentPlan instance with fields set when given an object with value', () => {
            const deserialized = new formaliseRepaymentPlan_1.FormaliseRepaymentPlan().deserialize({ option: formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT });
            chai_1.expect(deserialized).to.be.deep.equal({ option: formaliseRepaymentPlanOption_1.FormaliseRepaymentPlanOption.SIGN_SETTLEMENT_AGREEMENT });
        });
    });
});
