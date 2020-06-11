"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const howMuchPaidClaimant_1 = require("response/form/models/howMuchPaidClaimant");
describe('HowMuchPaidClaimant', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when undefined option', () => {
            const errors = validator.validateSync(new howMuchPaidClaimant_1.HowMuchPaidClaimant(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, howMuchPaidClaimant_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should reject when invalid option', () => {
            const errors = validator.validateSync(new howMuchPaidClaimant_1.HowMuchPaidClaimant('reject all'));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, howMuchPaidClaimant_1.ValidationErrors.OPTION_REQUIRED);
        });
        it('should accept when recognised option', () => {
            howMuchPaidClaimant_1.HowMuchPaidClaimantOption.all().forEach(type => {
                const errors = validator.validateSync(new howMuchPaidClaimant_1.HowMuchPaidClaimant(type));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
