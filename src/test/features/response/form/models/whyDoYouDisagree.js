"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
describe('WhyDoYouDisagree', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const model = new whyDoYouDisagree_1.WhyDoYouDisagree();
            chai_1.expect(model.text).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new whyDoYouDisagree_1.WhyDoYouDisagree().deserialize(undefined)).to.eql(new whyDoYouDisagree_1.WhyDoYouDisagree());
        });
        it('should return an instance initialised with defaults for null', () => {
            chai_1.expect(new whyDoYouDisagree_1.WhyDoYouDisagree().deserialize(null)).to.eql(new whyDoYouDisagree_1.WhyDoYouDisagree());
        });
        it('should return an instance from given object', () => {
            const description = 'I do not owe this money';
            const result = new whyDoYouDisagree_1.WhyDoYouDisagree().deserialize({
                text: description
            });
            chai_1.expect(result.text).to.be.equals(description);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject WhyDoYouDisagree text with undefined', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, whyDoYouDisagree_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject WhyDoYouDisagree text with null type', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, whyDoYouDisagree_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject WhyDoYouDisagree text with empty string', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree(''));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, whyDoYouDisagree_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject WhyDoYouDisagree text with white spaces string', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree('   '));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, whyDoYouDisagree_1.ValidationErrors.EXPLANATION_REQUIRED);
        });
        it('should reject WhyDoYouDisagree text with more than max allowed characters', () => {
            const text = validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1);
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree(text));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
        it('should accept WhyDoYouDisagree text with max allowed characters', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH)));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid WhyDoYouDisagree text', () => {
            const errors = validator.validateSync(new whyDoYouDisagree_1.WhyDoYouDisagree('i am owed money £300'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
