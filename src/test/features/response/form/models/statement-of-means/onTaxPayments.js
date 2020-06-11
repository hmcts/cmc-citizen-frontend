"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const onTaxPayments_1 = require("response/form/models/statement-of-means/onTaxPayments");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('OnTaxPayments', () => {
    describe('deserialize', () => {
        it('should return empty OnTaxPayments for undefined given as input', () => {
            const actual = new onTaxPayments_1.OnTaxPayments().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(onTaxPayments_1.OnTaxPayments);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.amountYouOwe).to.be.eq(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
        it('should return OnTaxPayments with populated only declared', () => {
            const actual = new onTaxPayments_1.OnTaxPayments().deserialize({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.amountYouOwe).to.be.eq(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
        it('should return fully populated OnTaxPayments', () => {
            const actual = new onTaxPayments_1.OnTaxPayments().deserialize({ declared: true, amountYouOwe: 100, reason: 'Various taxes' });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.amountYouOwe).to.be.eq(100);
            chai_1.expect(actual.reason).to.be.eq('Various taxes');
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = new onTaxPayments_1.OnTaxPayments().deserialize({ declared: false, amountYouOwe: 100, reason: 'Various taxes' });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.amountYouOwe).to.be.eq(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
    });
    describe('fromObject', () => {
        it('should return empty OnTaxPayments for undefined given as input', () => {
            const actual = onTaxPayments_1.OnTaxPayments.fromObject(undefined);
            chai_1.expect(actual).to.be.eq(undefined);
        });
        it('should return OnTaxPayments with populated only declared', () => {
            const actual = onTaxPayments_1.OnTaxPayments.fromObject({ declared: false });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.amountYouOwe).to.be.eq(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
        it('should return fully populated OnTaxPayments', () => {
            const actual = onTaxPayments_1.OnTaxPayments.fromObject({ declared: true, amountYouOwe: 100, reason: 'Various taxes' });
            chai_1.expect(actual.declared).to.be.eq(true);
            chai_1.expect(actual.amountYouOwe).to.be.eq(100);
            chai_1.expect(actual.reason).to.be.eq('Various taxes');
        });
        it('should NOT populate other fields when declared = false', () => {
            const actual = onTaxPayments_1.OnTaxPayments.fromObject({ declared: false, amountYouOwe: 100, reason: 'Various taxes' });
            chai_1.expect(actual.declared).to.be.eq(false);
            chai_1.expect(actual.amountYouOwe).to.be.eq(undefined);
            chai_1.expect(actual.reason).to.be.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when declared is', () => {
            context('undefined', () => {
                it('should reject', () => {
                    const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments());
                    chai_1.expect(errors.length).to.equal(1);
                    validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.YES_NO_REQUIRED);
                });
            });
            context('true', () => {
                context('should reject when', () => {
                    it('all are not given', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, undefined, undefined));
                        chai_1.expect(errors.length).to.equal(2);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED);
                        validationUtils_1.expectValidationError(errors, onTaxPayments_1.ValidationErrors.REASON_REQUIRED);
                    });
                    it('amount is negative', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, -1, 'Taxes'));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED);
                    });
                    it('amount is set to 0', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, 0, 'Taxes'));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED);
                    });
                    it('amount has more then two decimal points', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, 0.001, 'Taxes'));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.VALID_OWED_AMOUNT_REQUIRED);
                    });
                    it('reason is blank', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, 0.01, ''));
                        chai_1.expect(errors.length).to.equal(1);
                        validationUtils_1.expectValidationError(errors, onTaxPayments_1.ValidationErrors.REASON_REQUIRED);
                    });
                });
                context('should accept when', () => {
                    it('values are valid', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(true, 0.01, 'Taxes'));
                        chai_1.expect(errors.length).to.equal(0);
                    });
                });
            });
            context('false', () => {
                context('should accept when', () => {
                    it('amount and reason are undefined', () => {
                        const errors = validator.validateSync(new onTaxPayments_1.OnTaxPayments(false, undefined, undefined));
                        chai_1.expect(errors.length).to.equal(0);
                    });
                });
            });
        });
    });
});
