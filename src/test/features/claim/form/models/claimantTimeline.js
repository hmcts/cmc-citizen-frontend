"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const claimantTimeline_1 = require("claim/form/models/claimantTimeline");
const class_validator_1 = require("@hmcts/class-validator");
const timelineRow_1 = require("forms/models/timelineRow");
const timeline_1 = require("forms/models/timeline");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('ClaimantTimeline', () => {
    describe('on init', () => {
        it(`should create array of ${timeline_1.INIT_ROW_COUNT} empty instances of TimelineRow`, () => {
            const actual = (new claimantTimeline_1.ClaimantTimeline()).rows;
            chai_1.expect(actual.length).to.equal(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = claimantTimeline_1.ClaimantTimeline.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return ClaimantTimeline with list of empty TimelineRow[] when empty input given', () => {
            const actual = claimantTimeline_1.ClaimantTimeline.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return ClaimantTimeline with first element on list populated', () => {
            const actual = claimantTimeline_1.ClaimantTimeline.fromObject({ rows: [{ date: 'May', description: 'OK' }] });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.date).to.eq('May');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return object with list of TimelineRow longer than default', () => {
            const actual = claimantTimeline_1.ClaimantTimeline.fromObject({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    { date: 'Feb', description: 'OK' },
                    { date: 'Mar', description: 'OK' },
                    { date: 'Apr', description: 'OK' },
                    { date: 'May', description: 'OK' },
                    { date: 'Jun', description: 'OK' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.greaterThan(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject when no rows given', () => {
            const errors = validator.validateSync(new claimantTimeline_1.ClaimantTimeline([]));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, claimantTimeline_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
        });
        it('should accept when at least one row given', () => {
            const errors = validator.validateSync(new claimantTimeline_1.ClaimantTimeline([new timelineRow_1.TimelineRow('may', 'ok')]));
            chai_1.expect(errors.length).to.equal(0);
        });
    });
});
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
