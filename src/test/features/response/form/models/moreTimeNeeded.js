"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
describe('MoreTimeNeeded', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined option', () => {
            const errors = validator.validateSync(new moreTimeNeeded_1.MoreTimeNeeded(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, moreTimeNeeded_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should reject with invalid value', () => {
            const errors = validator.validateSync(new moreTimeNeeded_1.MoreTimeNeeded('maybe'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, moreTimeNeeded_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should accept mediation with recognised type', () => {
            moreTimeNeeded_1.MoreTimeNeededOption.all().forEach(type => {
                const errors = validator.validateSync(new moreTimeNeeded_1.MoreTimeNeeded(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
