"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const eligibility_1 = require("eligibility/model/eligibility");
const validationErrors_1 = require("forms/validation/validationErrors");
const yesNoOption_1 = require("models/yesNoOption");
const claimValue_1 = require("features/eligibility/model/claimValue");
const claimType_1 = require("features/eligibility/model/claimType");
const defendantAgeOption_1 = require("features/eligibility/model/defendantAgeOption");
/* tslint:disable:no-unused-expression */
describe('Eligibility', () => {
    context('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject eligibility if not complete', () => {
            const errors = validator.validateSync(new eligibility_1.Eligibility(claimValue_1.ClaimValue.UNDER_10000, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, defendantAgeOption_1.DefendantAgeOption.YES, claimType_1.ClaimType.PERSONAL_CLAIM, yesNoOption_1.YesNoOption.YES, undefined, yesNoOption_1.YesNoOption.NO));
            chai_1.expect(errors).to.have.length(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
        });
        it('should be valid if all eligibility provided', () => {
            const errors = validator.validateSync(new eligibility_1.Eligibility(claimValue_1.ClaimValue.UNDER_10000, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, defendantAgeOption_1.DefendantAgeOption.YES, claimType_1.ClaimType.PERSONAL_CLAIM, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO));
            chai_1.expect(errors).to.be.empty;
        });
    });
    context('eligible', () => {
        it('should be valid if all eligibility answers are eligible', () => {
            const eligibility = new eligibility_1.Eligibility(claimValue_1.ClaimValue.UNDER_10000, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, defendantAgeOption_1.DefendantAgeOption.COMPANY_OR_ORGANISATION, claimType_1.ClaimType.PERSONAL_CLAIM, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO);
            chai_1.expect(eligibility.eligible).to.be.true;
        });
        it('should be invalid if any eligibility answer is not eligible', () => {
            const eligibility = new eligibility_1.Eligibility(claimValue_1.ClaimValue.UNDER_10000, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, yesNoOption_1.YesNoOption.YES, defendantAgeOption_1.DefendantAgeOption.NO, claimType_1.ClaimType.PERSONAL_CLAIM, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO, yesNoOption_1.YesNoOption.NO);
            chai_1.expect(eligibility.eligible).to.be.false;
        });
    });
});
