"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const declaration_1 = require("ccj/form/models/declaration");
describe('Declaration', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const declaration = new declaration_1.Declaration();
            chai_1.expect(declaration.signed).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject declaration with null type', () => {
            const errors = validator.validateSync(new declaration_1.Declaration(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, declaration_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should reject declaration with empty string', () => {
            const errors = validator.validateSync(new declaration_1.Declaration());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, declaration_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should reject declaration without accepting the facts stated in the claim', () => {
            const errors = validator.validateSync(new declaration_1.Declaration(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, declaration_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should accept declaration accepting the facts stated in the claim', () => {
            const errors = validator.validateSync(new declaration_1.Declaration(true));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
