"use strict";
/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const settlementAgreement_1 = require("claimant-response/form/models/settlementAgreement");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('SettlementAgreement', () => {
    describe('constructor', () => {
        it('should set the primitive fields to undefined', () => {
            const settlementAgreement = new settlementAgreement_1.SettlementAgreement();
            chai_1.expect(settlementAgreement.signed).to.be.undefined;
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject settlement agreement with null type', () => {
            const errors = validator.validateSync(new settlementAgreement_1.SettlementAgreement(null));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should reject settlement agreement without signature', () => {
            const errors = validator.validateSync(new settlementAgreement_1.SettlementAgreement());
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should reject settlement agreement with undefined', () => {
            const errors = validator.validateSync(new settlementAgreement_1.SettlementAgreement(undefined));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DECLARATION_REQUIRED);
        });
        it('should accept settlement agreement with signature', () => {
            const errors = validator.validateSync(new settlementAgreement_1.SettlementAgreement(true));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
