"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('RejectionReason', () => {
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should show validation error when no rejection reason is entered', () => {
            const errors = validator.validateSync(new rejectionReason_1.RejectionReason(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, rejectionReason_1.ValidationErrors.EXPLAIN_WHY_YOU_REJECT_REPAYMENT_PLAN);
        });
        it('should throw no validation error when rejection reason is entered', () => {
            const errors = validator.validateSync(new rejectionReason_1.RejectionReason('some rejection reason'));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
    describe('fromObject', () => {
        it('should return undefined when undefined provided', () => {
            const model = rejectionReason_1.RejectionReason.fromObject(undefined);
            chai_1.expect(model).to.be.eq(undefined);
        });
    });
    describe('deserialize', () => {
        it('should return an instance initialised with defaults for undefined', () => {
            chai_1.expect(new rejectionReason_1.RejectionReason().deserialize(undefined)).to.be.eql(new rejectionReason_1.RejectionReason());
        });
        it('should return an instance from given object', () => {
            const actual = new rejectionReason_1.RejectionReason().deserialize({ text: 'reason' });
            chai_1.expect(actual).to.be.eql(new rejectionReason_1.RejectionReason('reason'));
        });
    });
});
