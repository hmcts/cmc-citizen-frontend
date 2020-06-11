"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const defendantSettlementResponse_1 = require("settlement-agreement/form/models/defendantSettlementResponse");
describe('DefendantSettlementResponse', () => {
    describe('constructor', () => {
        it('should set the fields to undefined when given no option', () => {
            const defendantSettlementResponse = new defendantSettlementResponse_1.DefendantSettlementResponse();
            chai_1.expect(defendantSettlementResponse.option).to.be.equal(undefined);
        });
        defendantSettlementResponse_1.DefendantSettlementResponseOption.all().forEach((option) => {
            it(`Should set the field to ${option} when given ${option}`, () => {
                const defendantSettlementResponse = new defendantSettlementResponse_1.DefendantSettlementResponse(option);
                chai_1.expect(defendantSettlementResponse.option).to.be.equal(option);
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('should reject when', () => {
            it('undefined option', () => {
                const errors = validator.validateSync(new defendantSettlementResponse_1.DefendantSettlementResponse(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, defendantSettlementResponse_1.ValidationErrors.OPTION_REQUIRED);
            });
        });
        describe('should accept when', () => {
            context('valid form with selected option', () => {
                defendantSettlementResponse_1.DefendantSettlementResponseOption.all().forEach((option) => {
                    it(option, () => {
                        const errors = validator.validateSync(new defendantSettlementResponse_1.DefendantSettlementResponse(option));
                        chai_1.expect(errors).to.be.length(0);
                    });
                });
            });
        });
    });
});
