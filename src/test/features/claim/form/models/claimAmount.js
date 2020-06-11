"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const claimAmountBreakdown_1 = require("claim/form/models/claimAmountBreakdown");
const claimAmountRow_1 = require("claim/form/models/claimAmountRow");
describe('ClaimAmountBreakdown', () => {
    describe('on init', () => {
        it('should return 4 rows by default', () => {
            chai_1.expect(new claimAmountBreakdown_1.ClaimAmountBreakdown().rows).to.have.lengthOf(4);
        });
        it('should return initiated objects', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            for (let row of actual.rows) {
                chai_1.expect(row).to.eql(new claimAmountRow_1.ClaimAmountRow(undefined, undefined));
            }
        });
    });
    describe('form object deserialization', () => {
        it('should return undefined when value is undefined', () => {
            chai_1.expect(claimAmountBreakdown_1.ClaimAmountBreakdown.fromObject(undefined)).to.be.equal(undefined);
        });
        it('should return null when value is null', () => {
            chai_1.expect(claimAmountBreakdown_1.ClaimAmountBreakdown.fromObject(null)).to.be.equal(null);
        });
        it('should leave missing fields undefined', () => {
            chai_1.expect(claimAmountBreakdown_1.ClaimAmountBreakdown.fromObject({})).to.deep.equal(new claimAmountBreakdown_1.ClaimAmountBreakdown([]));
        });
        it('should deserialize all fields', () => {
            chai_1.expect(claimAmountBreakdown_1.ClaimAmountBreakdown.fromObject({
                rows: [
                    {
                        reason: 'Something',
                        amount: '100.01'
                    }
                ]
            })).to.deep.equal(new claimAmountBreakdown_1.ClaimAmountBreakdown([new claimAmountRow_1.ClaimAmountRow('Something', 100.01)]));
        });
    });
    describe('deserialize', () => {
        it('should return a ClaimAmountBreakdown instance', () => {
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({});
            chai_1.expect(deserialized).to.be.instanceof(claimAmountBreakdown_1.ClaimAmountBreakdown);
        });
        it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given "undefined"', () => {
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(undefined);
            chai_1.expect(deserialized.rows).to.have.lengthOf(4);
        });
        it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given "null"', () => {
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(null);
            chai_1.expect(deserialized.rows).to.have.lengthOf(4);
        });
        it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given an empty object', () => {
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({});
            chai_1.expect(deserialized.rows).to.have.lengthOf(4);
        });
        it('should return a ClaimAmountBreakdown instance with "rows" of length 4 with first populated when given an object of ClaimAmountRow', () => {
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({ rows: [{ reason: 'reason', amount: 200 }] });
            chai_1.expect(deserialized.rows).to.have.lengthOf(4);
            chai_1.expect(deserialized.rows[0]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow('reason', 200));
            chai_1.expect(deserialized.rows[1]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow(undefined, undefined));
            chai_1.expect(deserialized.rows[2]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow(undefined, undefined));
            chai_1.expect(deserialized.rows[3]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow(undefined, undefined));
        });
        it('should return a ClaimAmountBreakdown instance with "rows" of length 4 when given 4 objects of ClaimAmountRow', () => {
            const input = {
                rows: [
                    { reason: 'reason', amount: 200 },
                    { reason: 'reason', amount: 101.23 },
                    { reason: 'reason', amount: 34.21 },
                    { reason: 'reason', amount: 3000 }
                ]
            };
            let deserialized = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize(input);
            chai_1.expect(deserialized.rows).to.have.lengthOf(4);
            chai_1.expect(deserialized.rows[0]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow('reason', 200));
            chai_1.expect(deserialized.rows[1]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow('reason', 101.23));
            chai_1.expect(deserialized.rows[2]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow('reason', 34.21));
            chai_1.expect(deserialized.rows[3]).to.deep.eq(new claimAmountRow_1.ClaimAmountRow('reason', 3000));
        });
    });
    describe('appendRow', () => {
        it('should add empty element to list of rows', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            chai_1.expect(actual.rows.length).to.be.eq(claimAmountBreakdown_1.INIT_ROW_COUNT);
            actual.appendRow();
            chai_1.expect(actual.rows.length).to.be.eq(claimAmountBreakdown_1.INIT_ROW_COUNT + 1);
        });
        it('should append three row when called thrice', () => {
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown([]);
            breakdown.appendRow();
            breakdown.appendRow();
            breakdown.appendRow();
            chai_1.expect(breakdown.rows).to.have.lengthOf(3);
        });
        it('should add only up to 20 elements', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            chai_1.expect(actual.rows.length).to.be.eq(claimAmountBreakdown_1.INIT_ROW_COUNT);
            for (let i = 0; i < claimAmountBreakdown_1.MAX_NUMBER_OF_ROWS + 1; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.rows.length).to.be.eq(claimAmountBreakdown_1.MAX_NUMBER_OF_ROWS);
        });
    });
    describe('removeExcessRows', () => {
        it('should filter out all elements from list when empty', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            chai_1.expect(actual.rows.length).to.be.eq(claimAmountBreakdown_1.INIT_ROW_COUNT);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(1);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should not filter out any element from list when all populated', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({
                rows: [
                    { amount: 1, reason: 'OK' },
                    { amount: 2, reason: 'OK' },
                    { amount: 3.1, reason: 'OK' },
                    { amount: 12.54, reason: 'OK' },
                    { amount: 10, reason: 'OK' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(5);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(5);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when some of them are populated', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({
                rows: [
                    { amount: 11, reason: 'OK' },
                    { amount: 21, reason: 'OK' },
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
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown().deserialize({
                rows: [
                    { amount: 1, reason: 'OK' },
                    {},
                    { amount: 2, reason: 'OK' },
                    {}
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(4);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(2);
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        it('should reject breakdown if at least one row is invalid', () => {
            const errors = validator.validateSync(new claimAmountBreakdown_1.ClaimAmountBreakdown([new claimAmountRow_1.ClaimAmountRow(undefined, undefined), new claimAmountRow_1.ClaimAmountRow('Something', undefined)]));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, claimAmountRow_1.ValidationErrors.AMOUNT_REQUIRED);
        });
        it('should reject breakdown with empty rows', () => {
            const errors = validator.validateSync(new claimAmountBreakdown_1.ClaimAmountBreakdown([new claimAmountRow_1.ClaimAmountRow(undefined, undefined)]));
            chai_1.expect(errors.length).to.equal(1);
            validationUtils_1.expectValidationError(errors, claimAmountBreakdown_1.ValidationErrors.AMOUNT_REQUIRED);
        });
    });
    describe('totalAmount', () => {
        it('should return 0 if there are no rows', () => {
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown([]);
            chai_1.expect(breakdown.totalAmount()).to.equal(0);
        });
        it('should return the sum of row amounts', () => {
            let rows = [];
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 1.34));
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 7.83));
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 2.33));
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown(rows);
            chai_1.expect(breakdown.totalAmount()).to.equal(11.5);
        });
        it('should return the sum of row amounts excluding negatives', () => {
            let rows = [];
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 1.34));
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 7.83));
            rows.push(new claimAmountRow_1.ClaimAmountRow('', 2.33));
            rows.push(new claimAmountRow_1.ClaimAmountRow('', -2.33));
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown(rows);
            chai_1.expect(breakdown.totalAmount()).to.equal(11.5);
        });
        it('should raise an error for null values', () => {
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown([
                new claimAmountRow_1.ClaimAmountRow('', null)
            ]);
            chai_1.expect(breakdown.totalAmount).to.throw(Error);
        });
        it('should raise an error for undefined values', () => {
            let breakdown = new claimAmountBreakdown_1.ClaimAmountBreakdown([
                new claimAmountRow_1.ClaimAmountRow('', undefined)
            ]);
            chai_1.expect(breakdown.totalAmount).to.throw(Error);
        });
    });
    describe('canAddMoreRows', () => {
        it('should return true when number of elements is lower than max number', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(true);
        });
        it('should return true when number of rows is equal max', () => {
            const actual = new claimAmountBreakdown_1.ClaimAmountBreakdown();
            for (let i = 0; i < claimAmountBreakdown_1.MAX_NUMBER_OF_ROWS; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(false);
        });
    });
});
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(claimAmountRow_1.ClaimAmountRow);
        chai_1.expect(item.amount).to.eq(undefined);
        chai_1.expect(item.reason).to.eq(undefined);
    });
}
function expectAllRowsToBePopulated(rows) {
    rows.forEach(item => {
        chai_1.expect(!!item.amount).to.eq(true);
        chai_1.expect(!!item.reason).to.eq(true);
    });
}
