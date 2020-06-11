"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const explanation_1 = require("response/form/models/statement-of-means/explanation");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('Explanation', () => {
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should have validation errors if text is not provided', () => {
            const errors = validator.validateSync(new explanation_1.Explanation());
            validationUtils_1.expectValidationError(errors, explanation_1.ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW);
        });
        it('should have validation errors if given a blank string', () => {
            const errors = validator.validateSync(new explanation_1.Explanation(''));
            validationUtils_1.expectValidationError(errors, explanation_1.ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW);
        });
        it('should have validation errors if given a whitespace string', () => {
            const errors = validator.validateSync(new explanation_1.Explanation('    '));
            validationUtils_1.expectValidationError(errors, explanation_1.ValidationErrors.EXPLAIN_WHY_YOU_CANT_PAY_NOW);
        });
        it('should have validation errors if given too many characters', () => {
            const errors = validator.validateSync(new explanation_1.Explanation(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
        });
    });
});
