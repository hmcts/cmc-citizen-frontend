"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const timeline_1 = require("forms/models/timeline");
const validationConstraints_1 = require("forms/validation/validationConstraints");
const defendantEvidence_1 = require("response/form/models/defendantEvidence");
const evidenceRow_1 = require("forms/models/evidenceRow");
const evidenceType_1 = require("forms/models/evidenceType");
describe('DefendantEvidence', () => {
    describe('on init', () => {
        it(`should create array of ${timeline_1.INIT_ROW_COUNT} empty instances of EvidenceRow`, () => {
            const actual = (new defendantEvidence_1.DefendantEvidence()).rows;
            chai_1.expect(actual.length).to.equal(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = defendantEvidence_1.DefendantEvidence.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return DefendantTimeline with list of empty EvidenceRow[] when empty input given', () => {
            const actual = defendantEvidence_1.DefendantEvidence.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
            chai_1.expect(actual.comment).to.be.eq(undefined);
        });
        it('should return DefendantTimeline with first element on list populated', () => {
            const actual = defendantEvidence_1.DefendantEvidence.fromObject({ rows: [{ type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' }], comment: 'not ok' });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.type).to.eq(evidenceType_1.EvidenceType.PHOTO);
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows);
            chai_1.expect(actual.comment).to.be.eq('not ok');
        });
        it('should return object with list of EvidenceRow longer than default', () => {
            const actual = defendantEvidence_1.DefendantEvidence.fromObject({
                rows: [
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' },
                    { type: evidenceType_1.EvidenceType.PHOTO.value, description: 'OK' }
                ], comment: 'I do not agree'
            });
            chai_1.expect(actual.rows.length).to.be.greaterThan(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBePopulated(actual.rows);
            chai_1.expect(actual.comment).to.be.eq('I do not agree');
        });
    });
    describe('deserialize', () => {
        context('should return valid DefendantTimeline object with list of', () => {
            [{}, undefined].forEach(input => {
                it(`empty EvidenceRow when ${input} given`, () => {
                    const actual = new defendantEvidence_1.DefendantEvidence().deserialize(input);
                    chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                    expectAllRowsToBeEmpty(actual.rows);
                    chai_1.expect(actual.comment).to.be.eq(undefined);
                });
            });
            it('should return valid DefendantTimeline object with list of empty EvidenceRow', () => {
                const actual = new defendantEvidence_1.DefendantEvidence().deserialize({});
                chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                expectAllRowsToBeEmpty(actual.rows);
                chai_1.expect(actual.comment).to.be.eq(undefined);
            });
            it('should return valid DefendantTimeline object with populated first EvidenceRow', () => {
                const actual = new defendantEvidence_1.DefendantEvidence().deserialize({ rows: [{ type: evidenceType_1.EvidenceType.PHOTO, description: 'OK' }], comment: 'fine' });
                chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                const populatedItem = actual.rows[0];
                chai_1.expect(populatedItem.type).to.eq(evidenceType_1.EvidenceType.PHOTO);
                chai_1.expect(populatedItem.description).to.eq('OK');
                expectAllRowsToBeEmpty(actual.rows.slice(1));
                chai_1.expect(actual.comment).to.be.eq('fine');
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should reject when', () => {
            it('an invalid row given', () => {
                const errors = validator.validateSync(new defendantEvidence_1.DefendantEvidence([row(evidenceType_1.EvidenceType.PHOTO, validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1))], ''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
            it('an invalid row given', () => {
                const errors = validator.validateSync(new defendantEvidence_1.DefendantEvidence([row(evidenceType_1.EvidenceType.PHOTO, 'ok')], validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
        context('should accept when', () => {
            it('no rows given, no comment', () => {
                const errors = validator.validateSync(new defendantEvidence_1.DefendantEvidence([]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('valid rows rows given and valid comment', () => {
                const errors = validator.validateSync(new defendantEvidence_1.DefendantEvidence([row(evidenceType_1.EvidenceType.PHOTO, 'ok'), row(evidenceType_1.EvidenceType.PHOTO, 'ok')], 'comment'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
function row(type, description) {
    return new evidenceRow_1.EvidenceRow(type, description);
}
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(evidenceRow_1.EvidenceRow);
        chai_1.expect(item.isEmpty()).to.eq(true);
    });
}
function expectAllRowsToBePopulated(rows) {
    rows.forEach(item => {
        chai_1.expect(item.isEmpty()).to.eq(false);
    });
}
