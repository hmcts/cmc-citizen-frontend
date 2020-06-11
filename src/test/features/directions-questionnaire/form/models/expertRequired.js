"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
const expertRequired_1 = require("directions-questionnaire/forms/models/expertRequired");
describe('ExpertRequired', () => {
    context('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const expertRequired = new expertRequired_1.ExpertRequired();
            chai_1.expect(expertRequired.option).to.be.undefined;
        });
    });
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject expert required with null type', () => {
            const errors = validator.validateSync(new expertRequired_1.ExpertRequired(null));
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should reject expert required with no expert required option ', () => {
            const errors = validator.validateSync(new expertRequired_1.ExpertRequired());
            chai_1.expect(errors).to.not.be.empty;
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should accept expert required with option present', () => {
            const errors = validator.validateSync(new expertRequired_1.ExpertRequired(yesNoOption_1.YesNoOption.YES));
            chai_1.expect(errors).to.be.empty;
        });
    });
    context('fromObject should return', () => {
        it('undefined when undefined provided', () => {
            const model = expertRequired_1.ExpertRequired.fromObject(undefined);
            chai_1.expect(model).to.be.undefined;
        });
        it('empty object when unknown value provided', () => {
            const model = expertRequired_1.ExpertRequired.fromObject({ option: 'I do not know this value!' });
            chai_1.expect(model.option).to.be.undefined;
        });
        it(`valid object when values provided`, () => {
            const model = expertRequired_1.ExpertRequired.fromObject({ option: 'yes' });
            chai_1.expect(model.option).to.equal(yesNoOption_1.YesNoOption.YES);
        });
    });
    context('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new expertRequired_1.ExpertRequired().deserialize(undefined)).to.deep.equal(new expertRequired_1.ExpertRequired());
        });
        it('should return an instance from given object', () => {
            const actual = new expertRequired_1.ExpertRequired().deserialize({ option: 'yes' });
            chai_1.expect(actual).to.deep.equal(new expertRequired_1.ExpertRequired(yesNoOption_1.YesNoOption.YES));
        });
    });
    context('isCompleted', () => {
        it('Should be marked completed when an option is selected', () => {
            const expertRequired = new expertRequired_1.ExpertRequired(yesNoOption_1.YesNoOption.YES);
            chai_1.expect(expertRequired.isCompleted()).to.be.true;
        });
        it('Should be marked not complete when no option is selected', () => {
            const expertRequired = new expertRequired_1.ExpertRequired(undefined);
            chai_1.expect(expertRequired.isCompleted()).to.be.false;
        });
    });
});
