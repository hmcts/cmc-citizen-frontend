"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const selfWitness_1 = require("directions-questionnaire/forms/models/selfWitness");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
describe('SelfWitness', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const selfWitness = new selfWitness_1.SelfWitness();
            chai_1.expect(selfWitness.option).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject self witness with null type', () => {
            const errors = validator.validateSync(new selfWitness_1.SelfWitness(null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject self witness with no self witness option ', () => {
            const errors = validator.validateSync(new selfWitness_1.SelfWitness());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept self witness with option present', () => {
            const errors = validator.validateSync(new selfWitness_1.SelfWitness(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.be.empty;
        });
    });
    describe('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = selfWitness_1.SelfWitness.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
        it('empty object when unknown value provided', () => {
            const model = selfWitness_1.SelfWitness.fromObject({ option: 'I do not know this value!' });
            chai_1.expect(model.option).to.be.eq(undefined);
        });
        it(`valid object when values provided`, () => {
            const model = selfWitness_1.SelfWitness.fromObject({ option: 'yes' });
            chai_1.expect(model.option).to.be.eq(yesNoOption_1.YesNoOption.YES);
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new selfWitness_1.SelfWitness().deserialize(undefined)).to.be.eql(new selfWitness_1.SelfWitness());
        });
        it('should return an instance from given object', () => {
            const actual = new selfWitness_1.SelfWitness().deserialize({ option: 'yes' });
            chai_1.expect(actual).to.be.eql(new selfWitness_1.SelfWitness(yesNoOption_1.YesNoOption.YES));
        });
    });
    describe('isCompleted', () => {
        it('Should be marked completed when an option is selected', () => {
            const selfWitness = new selfWitness_1.SelfWitness(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(selfWitness.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when no option is selected', () => {
            const selfWitness = new selfWitness_1.SelfWitness(undefined);
            chai_1.expect(selfWitness.isCompleted()).to.be.false;
        });
    });
});
