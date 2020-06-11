"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const declaration_1 = require("offer/form/models/declaration");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Declaration', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject unspecified declaration', () => {
            const errors = validator.validateSync(new declaration_1.Declaration());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should reject unsigned declaration', () => {
            const errors = validator.validateSync(new declaration_1.Declaration(false));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should accept a signed declaration', () => {
            const errors = validator.validateSync(new declaration_1.Declaration(true));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
