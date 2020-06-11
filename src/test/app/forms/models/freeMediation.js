"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const freeMediation_1 = require("forms/models/freeMediation");
describe('FreeMediation', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined option', () => {
            const errors = validator.validateSync(new freeMediation_1.FreeMediation(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, freeMediation_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should reject with invalid value', () => {
            const errors = validator.validateSync(new freeMediation_1.FreeMediation('maybe'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, freeMediation_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should accept mediation with recognised type', () => {
            freeMediation_1.FreeMediationOption.all().forEach(type => {
                const errors = validator.validateSync(new freeMediation_1.FreeMediation(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
