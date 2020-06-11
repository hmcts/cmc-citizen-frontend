"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const claimReference_1 = require("forms/models/claimReference");
describe('ClaimReference', () => {
    describe('constructor', () => {
        it('should have the primitive field set to undefined', () => {
            let claimReference = new claimReference_1.ClaimReference();
            chai_1.expect(claimReference.reference).to.be.undefined;
        });
    });
    describe('deserialize', () => {
        it('should return a ClaimReference instance initialised with defaults given undefined', () => {
            chai_1.expect(new claimReference_1.ClaimReference().deserialize(undefined)).to.eql(new claimReference_1.ClaimReference());
        });
        it('should return a ClaimReference instance initialised with defaults when given null', () => {
            chai_1.expect(new claimReference_1.ClaimReference().deserialize(null)).to.eql(new claimReference_1.ClaimReference());
        });
        it('should return a ClaimReference instance with set fields from given object', () => {
            let result = new claimReference_1.ClaimReference().deserialize({
                reference: '000MC001'
            });
            chai_1.expect(result.reference).to.equal('000MC001');
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject empty claim reference', () => {
            const errors = validator.validateSync(new claimReference_1.ClaimReference());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, claimReference_1.ValidationErrors.CLAIM_REFERENCE_REQUIRED);
        });
        it('should accepts valid CMC claim reference', () => {
            const errors = validator.validateSync(new claimReference_1.ClaimReference('000MC001'));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept valid CMC claim reference ignoring case', () => {
            const errors = validator.validateSync(new claimReference_1.ClaimReference('000mc001'));
            chai_1.expect(errors.length).to.equal(0);
        });
        it('should accept CCBC claim reference', () => {
            const errors = validator.validateSync(new claimReference_1.ClaimReference('A1LL3CC5'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
