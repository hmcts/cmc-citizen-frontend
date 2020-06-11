"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const claimAmountRow_1 = require("claim/form/models/claimAmountRow");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('ClaimAmountRow', () => {
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(claimAmountRow_1.ClaimAmountRow.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(claimAmountRow_1.ClaimAmountRow.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(claimAmountRow_1.ClaimAmountRow.fromObject({})).to.deep.equal(new claimAmountRow_1.ClaimAmountRow());
        });
        it('should deserialize all fields', () => {
            chai_1.expect(claimAmountRow_1.ClaimAmountRow.fromObject({
                reason: 'Something',
                amount: '100.01'
            })).to.deep.equal(new claimAmountRow_1.ClaimAmountRow('Something', 100.01));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should reject when', () => {
            it('row with reason, no amount', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_REQUIRED);
            });
            it('row with amount, no reason', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow(undefined, 100.00));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.REASON_REQUIRED);
            });
            it('row with zero amount', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', 0));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('row with amount lesser then 0.01', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', 0.009));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('row with negative amount', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', -0.01));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
            it('row with more than two decimal places in amount', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', 10.123));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('row with valid amount and too long reason', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow(validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1), 1.01));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.REASON_TOO_LONG);
            });
            it('row with amount having invalid comma', () => {
                const errors = validator.validateSync(claimAmountRow_1.ClaimAmountRow.fromObject({
                    reason: 'Something',
                    amount: '11,10'
                }));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_NOT_VALID);
            });
        });
        context('should accept', () => {
            it('row with both reason and valid amount', () => {
                const errors = validator.validateSync(new claimAmountRow_1.ClaimAmountRow('Something', 0.01));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('row with amount containing comma', () => {
                const errors = validator.validateSync({ reason: 'Something', amount: '1,100' });
                chai_1.expect(errors.length).to.equal(0);
            });
            it('row with amount having valid comma', () => {
                const errors = validator.validateSync(claimAmountRow_1.ClaimAmountRow.fromObject({
                    reason: 'Something',
                    amount: '1,100'
                }));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('empty row', () => {
                const errors = validator.validateSync(claimAmountRow_1.ClaimAmountRow.empty());
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
