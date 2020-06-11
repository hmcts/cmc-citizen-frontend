"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const evidenceRow_1 = require("forms/models/evidenceRow");
const evidenceType_1 = require("forms/models/evidenceType");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const validationErrors_1 = require("forms/validation/validationErrors");
describe('EvidenceRow', () => {
    describe('empty', () => {
        it('should return empty instances of EvidenceRow', () => {
            const actual = evidenceRow_1.EvidenceRow.empty();
            chai_1.expect(actual).instanceof(evidenceRow_1.EvidenceRow);
            chai_1.expect(actual.type).to.eq(undefined);
            chai_1.expect(actual.description).to.eq(undefined);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when both are valid strings', () => {
                const errors = validator.validateSync(new evidenceRow_1.EvidenceRow(evidenceType_1.EvidenceType.OTHER, 'description'));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when valid type given and undefined description', () => {
                const errors = validator.validateSync(new evidenceRow_1.EvidenceRow(evidenceType_1.EvidenceType.OTHER, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when description is too long', () => {
                const errors = validator.validateSync(new evidenceRow_1.EvidenceRow(evidenceType_1.EvidenceType.OTHER, validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
    });
});
