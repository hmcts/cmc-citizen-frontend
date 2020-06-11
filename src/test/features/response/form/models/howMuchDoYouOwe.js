"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const howMuchDoYouOwe_1 = require("response/form/models/howMuchDoYouOwe");
const validationErrors_1 = require("forms/validation/validationErrors");
const claimAmount = 5000;
const amountOwed = 2000;
describe('HowMuchDoYouOwe', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_REQUIRED);
        });
        it('should reject when value is negative', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(-amountOwed, claimAmount));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject when value is 0', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(0, claimAmount));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_NOT_VALID);
        });
        it('should reject when value is more then two decimal places', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(3.1415926, claimAmount));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
        });
        it('should reject when amount entered is more then claimed', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(9000, claimAmount));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_ENTERED_TOO_LARGE);
        });
        it('should accept when recognised option', () => {
            const errors = validator.validateSync(new howMuchDoYouOwe_1.HowMuchDoYouOwe(amountOwed, claimAmount));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
