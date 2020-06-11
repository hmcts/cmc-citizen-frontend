"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const timeline_1 = require("forms/models/timeline");
const timelineRow_1 = require("forms/models/timelineRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const class_validator_1 = require("@hmcts/class-validator");
const validationErrors_1 = require("forms/validation/validationErrors");
const multiRowForm_1 = require("forms/models/multiRowForm");
describe('Timeline', () => {
    describe('on init', () => {
        it(`should create array of ${timeline_1.INIT_ROW_COUNT} empty instances of TimelineRow`, () => {
            const actual = (new timeline_1.Timeline()).rows;
            chai_1.expect(actual.length).to.equal(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = timeline_1.Timeline.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return Timeline with list of empty TimelineRow[] when empty input given', () => {
            const actual = timeline_1.Timeline.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Timeline with first element on list populated', () => {
            const actual = timeline_1.Timeline.fromObject({ rows: [{ date: 'May', description: 'OK' }] });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.date).to.eq('May');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return object with list of TimelineRow longer than default', () => {
            const actual = timeline_1.Timeline.fromObject({
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
    describe('deserialize', () => {
        it('should return valid Timeline object with list of empty TimelineRow', () => {
            const actual = new timeline_1.Timeline().deserialize({});
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return valid Timeline object with populated first TimelineRow', () => {
            const actual = new timeline_1.Timeline().deserialize({ rows: [{ date: 'May', description: 'OK' }] });
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
            const populatedItem = actual.rows[0];
            chai_1.expect(populatedItem.date).to.eq('May');
            chai_1.expect(populatedItem.description).to.eq('OK');
            expectAllRowsToBeEmpty(actual.rows.slice(1));
        });
        it('should return valid Timeline object with list of row longer than default length', () => {
            const actual = new timeline_1.Timeline().deserialize({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    { date: 'Feb', description: 'OK' },
                    { date: 'Mar', description: 'OK' },
                    { date: 'Apr', description: 'OK' },
                    { date: 'May', description: 'OK' }
                ]
            });
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('appendRow', () => {
        it('adds empty element to list of rows', () => {
            const actual = new timeline_1.Timeline();
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
            actual.appendRow();
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT + 1);
        });
        it(`adds only up to the maximum row count elements`, () => {
            const actual = new timeline_1.Timeline();
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
            for (let i = 0; i < actual.getMaxNumberOfRows() + 1; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.rows.length).to.be.eq(actual.getMaxNumberOfRows());
        });
    });
    describe('removeExcessRows', () => {
        it('should filter out all elements from list when empty', () => {
            const actual = new timeline_1.Timeline();
            chai_1.expect(actual.rows.length).to.be.eq(timeline_1.INIT_ROW_COUNT);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(0);
        });
        it('should not filter out any element from list when all populated', () => {
            const actual = new timeline_1.Timeline().deserialize({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    { date: 'Feb', description: 'OK' },
                    { date: 'Mar', description: 'OK' },
                    { date: 'Apr', description: 'OK' },
                    { date: 'May', description: 'OK' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(5);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(5);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when some of them are populated', () => {
            const actual = new timeline_1.Timeline().deserialize({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    { date: 'Feb', description: 'OK' },
                    {},
                    {}
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(4);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(2);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when mixed', () => {
            const actual = new timeline_1.Timeline().deserialize({
                rows: [
                    { date: 'Jan', description: 'OK' },
                    {},
                    { date: 'Feb', description: 'OK' },
                    {}
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(4);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(2);
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('canAddMoreRows', () => {
        it('should return true when number of elements is lower than max number', () => {
            const actual = new timeline_1.Timeline();
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(true);
        });
        it('should return true when number of rows is equal max', () => {
            const actual = new timeline_1.Timeline();
            for (let i = 0; i < multiRowForm_1.MAX_NUMBER_OF_ROWS; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(false);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject only when an invalid row given', () => {
            const errors = validator.validateSync(new timeline_1.Timeline([row('', 'ok')]));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.DATE_REQUIRED);
        });
        context('should accept when', () => {
            it('no rows given', () => {
                const errors = validator.validateSync(new timeline_1.Timeline([]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('valid rows rows given', () => {
                const errors = validator.validateSync(new timeline_1.Timeline([row('may', 'ok'), row('june', 'ok')]));
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
