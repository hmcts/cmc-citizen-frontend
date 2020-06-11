"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const impactOfDispute_1 = require("response/form/models/impactOfDispute");
const validationErrors_1 = require("forms/validation/validationErrors");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const randomstring = require("randomstring");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('ImpactOfDispute', () => {
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should be valid when given max amount of characters', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute(randomstring.generate(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH));
            const errors = validator.validateSync(impactOfDispute);
            chai_1.expect(errors).to.be.empty;
        });
        it('should be valid when given empty string', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute('');
            const errors = validator.validateSync(impactOfDispute);
            chai_1.expect(errors).to.be.empty;
        });
        it('should be valid when given undefined', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute(undefined);
            const errors = validator.validateSync(impactOfDispute);
            chai_1.expect(errors).to.be.empty;
        });
        it('should be invalid when given too many characters', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute(randomstring.generate(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1));
            const errors = validator.validateSync(impactOfDispute);
            chai_1.expect(errors).to.have.lengthOf(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
    });
    context('deserialisation', () => {
        it('should use the text from provided object', () => {
            const testContent = 'I a test string';
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute().deserialize({ text: testContent });
            chai_1.expect(impactOfDispute.text).to.equal(testContent);
        });
        it('should set text to undefined if given undefined as input', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute().deserialize(undefined);
            chai_1.expect(impactOfDispute.text).to.be.undefined;
        });
    });
    context('new instance creation', () => {
        it('should set the text to undefined for new instance', () => {
            const impactOfDispute = new impactOfDispute_1.ImpactOfDispute();
            chai_1.expect(impactOfDispute.text).to.be.undefined;
        });
    });
});
