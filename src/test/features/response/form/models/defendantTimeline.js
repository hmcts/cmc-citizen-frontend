"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const timelineRow_1 = require("forms/models/timelineRow");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const timeline_1 = require("forms/models/timeline");
const validationConstraints_1 = require("forms/validation/validationConstraints");
describe('DefendantTimeline', () => {
    describe('on init', () => {
        it(`should create array of ${timeline_1.INIT_ROW_COUNT} empty instances of TimelineRow`, () => {
            const actual = (new defendantTimeline_1.DefendantTimeline()).rows;
            chai_1.expect(actual.length).to.equal(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = defendantTimeline_1.DefendantTimeline.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return DefendantTimeline with list of empty TimelineRow[] when empty input given', () => {
            const actual = defendantTimeline_1.DefendantTimeline.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
            chai_1.expect(actual.comment).to.be.eq(undefined);
        });
        it('should return DefendantTimeline with first element on list populated', () => {
            const actual = defendantTimeline_1.DefendantTimeline.fromObject({ rows: [{ date: 'May', description: 'OK' }], comment: 'not ok' });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.date).to.eq('May');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows);
            chai_1.expect(actual.comment).to.be.eq('not ok');
        });
        it('should return object with list of TimelineRow longer than default', () => {
            const actual = defendantTimeline_1.DefendantTimeline.fromObject({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    { date: 'Feb', description: 'OK' },
                    { date: 'Mar', description: 'OK' },
                    { date: 'Apr', description: 'OK' },
                    { date: 'May', description: 'OK' },
                    { date: 'Jun', description: 'OK' }
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
                it(`empty TimelineRow when ${input} given`, () => {
                    const actual = new defendantTimeline_1.DefendantTimeline().deserialize(input);
                    chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                    expectAllRowsToBeEmpty(actual.rows);
                    chai_1.expect(actual.comment).to.be.eq(undefined);
                });
            });
            it('should return valid DefendantTimeline object with list of empty TimelineRow', () => {
                const actual = new defendantTimeline_1.DefendantTimeline().deserialize({});
                chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                expectAllRowsToBeEmpty(actual.rows);
                chai_1.expect(actual.comment).to.be.eq(undefined);
            });
            it('should return valid DefendantTimeline object with populated first TimelineRow', () => {
                const actual = new defendantTimeline_1.DefendantTimeline().deserialize({ rows: [{ date: 'May', description: 'OK' }], comment: 'fine' });
                chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
                const populatedItem = actual.rows[0];
                chai_1.expect(populatedItem.date).to.eq('May');
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
                const errors = validator.validateSync(new defendantTimeline_1.DefendantTimeline([row('', 'ok')], ''));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
            });
            it('an invalid row given', () => {
                const errors = validator.validateSync(new defendantTimeline_1.DefendantTimeline([row('ok', 'ok')], validationUtils_1.generateString(validationConstraints_1.ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.TEXT_TOO_LONG);
            });
        });
        context('should accept when', () => {
            it('no rows given, no comment', () => {
                const errors = validator.validateSync(new defendantTimeline_1.DefendantTimeline([]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('valid rows rows given and valid comment', () => {
                const errors = validator.validateSync(new defendantTimeline_1.DefendantTimeline([row('may', 'ok'), row('june', 'ok')], 'comment'));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
function row(date, description) {
    return new timelineRow_1.TimelineRow(date, description);
}
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(timelineRow_1.TimelineRow);
        chai_1.expect(item.isEmpty()).to.eq(true);
    });
}
function expectAllRowsToBePopulated(rows) {
    rows.forEach(item => {
        chai_1.expect(item.isEmpty()).to.eq(false);
    });
}
