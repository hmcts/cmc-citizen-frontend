"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const otherWitnesses_1 = require("directions-questionnaire/forms/models/otherWitnesses");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
describe('OtherWitnesses', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const otherWitnesses = new otherWitnesses_1.OtherWitnesses();
            chai_1.expect(otherWitnesses.otherWitnesses).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject other witness with null type', () => {
            const errors = validator.validateSync(new otherWitnesses_1.OtherWitnesses(null, null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject other witness with no other witnesses option ', () => {
            const errors = validator.validateSync(new otherWitnesses_1.OtherWitnesses());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject other witnesses with yes option and no how many present', () => {
            const errors = validator.validateSync(new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
        });
        it('should accept other witness with option and how many present', () => {
            const errors = validator.validateSync(new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.YES, 1));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = otherWitnesses_1.OtherWitnesses.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
        it('empty object when unknown value provided', () => {
            const model = otherWitnesses_1.OtherWitnesses.fromObject({ otherWitnesses: 'I do not know this value!' });
            chai_1.expect(model.otherWitnesses).to.be.eq(undefined);
        });
        it(`valid object when values provided`, () => {
            const model = otherWitnesses_1.OtherWitnesses.fromObject({ otherWitnesses: 'yes' });
            chai_1.expect(model.otherWitnesses).to.be.eq(yesNoOption_1.YesNoOption.YES);
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new otherWitnesses_1.OtherWitnesses().deserialize(undefined)).to.be.eql(new otherWitnesses_1.OtherWitnesses());
        });
        it('should return an instance from given object', () => {
            const actual = new otherWitnesses_1.OtherWitnesses().deserialize({ otherWitnesses: 'yes', howMany: 1 });
            chai_1.expect(actual).to.be.eql(new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.fromObject(yesNoOption_1.YesNoOption.YES), 1));
        });
    });
    describe('isCompleted', () => {
        it('Should be marked not completed when no option is present', () => {
            const otherWitnesses = new otherWitnesses_1.OtherWitnesses(undefined);
            chai_1.expect(otherWitnesses.isCompleted()).to.be.false;
        });
        it('Should be marked complete when the no option is selected', () => {
            const otherWitnesses = new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.NO);
            chai_1.expect(otherWitnesses.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when the yes option is selected and no how many present', () => {
            const otherWitnesses = new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(otherWitnesses.isCompleted()).to.be.false;
        });
        it('Should be marked complete when the yes option is selected and how many is present', () => {
            const otherWitnesses = new otherWitnesses_1.OtherWitnesses(yesNoOption_1.YesNoOption.YES, 1);
            chai_1.expect(otherWitnesses.isCompleted()).to.be.true;
        });
    });
});
