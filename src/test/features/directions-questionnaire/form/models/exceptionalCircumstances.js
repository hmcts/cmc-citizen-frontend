"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const exceptionalCircumstances_1 = require("directions-questionnaire/forms/models/exceptionalCircumstances");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
describe('ExceptionalCircumstances', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances();
            chai_1.expect(exceptionalCircumstances.exceptionalCircumstances).to.be.undefined;
            chai_1.expect(exceptionalCircumstances.reason).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when null', () => {
            const errors = validator.validateSync(new exceptionalCircumstances_1.ExceptionalCircumstances(null, null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject with no exceptional circumstances option ', () => {
            const errors = validator.validateSync(new exceptionalCircumstances_1.ExceptionalCircumstances());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject exceptional circumstances with yes option and no reason', () => {
            const errors = validator.validateSync(new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, exceptionalCircumstances_1.ValidationErrors.REASON_REQUIRED);
        });
        it('should accept other witness with option and reason present', () => {
            const errors = validator.validateSync(new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.YES, 'reason'));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('isCompleted', () => {
        it('Should be marked not completed when no option is present', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances(undefined);
            chai_1.expect(exceptionalCircumstances.isDefendantCompleted()).to.be.false;
        });
        it('Should be marked complete when the no option is selected', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.NO);
            chai_1.expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true;
        });
        it('Should be marked not complete when the yes option is selected and no reason is entered', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(exceptionalCircumstances.isDefendantCompleted()).to.be.false;
        });
        it('Should be marked complete when the yes option is selected and reason is present', () => {
            const exceptionalCircumstances = new exceptionalCircumstances_1.ExceptionalCircumstances(yesNoOption_1.YesNoOption.YES, 'reason');
            chai_1.expect(exceptionalCircumstances.isDefendantCompleted()).to.be.true;
        });
    });
});
