"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const courtOrders_1 = require("response/form/models/statement-of-means/courtOrders");
const courtOrderRow_1 = require("response/form/models/statement-of-means/courtOrderRow");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const multiRowForm_1 = require("forms/models/multiRowForm");
describe('CourtOrders', () => {
    describe('on init', () => {
        it(`should create array of ${multiRowForm_1.INIT_ROW_COUNT} empty instances of CourtOrderRow`, () => {
            const actual = (new courtOrders_1.CourtOrders()).rows;
            chai_1.expect(actual.length).to.equal(multiRowForm_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('deserialize', () => {
        it('should return empty object', () => {
            const actual = new courtOrders_1.CourtOrders().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(courtOrders_1.CourtOrders);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.rows.length).to.eql(multiRowForm_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return CourtOrders with list of empty CourtOrderRow[] when declared = false', () => {
            const actual = new courtOrders_1.CourtOrders().deserialize({ declared: false });
            chai_1.expect(actual.rows.length).to.eql(multiRowForm_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return CourtOrders with first element on list populated', () => {
            const actual = new courtOrders_1.CourtOrders().deserialize({
                declared: true,
                rows: [{ amount: 100, instalmentAmount: 100, claimNumber: 'abc' }]
            });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.claimNumber).to.eq('abc');
            chai_1.expect(populatedItem.amount).to.eq(100);
            chai_1.expect(populatedItem.instalmentAmount).to.eq(100);
            expectAllRowsToBeEmpty(actual.rows);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = courtOrders_1.CourtOrders.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return CourtOrders with list of empty CourtOrderRow[] when declared = false', () => {
            const actual = courtOrders_1.CourtOrders.fromObject({ declared: 'false' });
            chai_1.expect(actual.rows.length).to.eql(0);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return CourtOrders with first element on list populated', () => {
            const actual = courtOrders_1.CourtOrders.fromObject({
                declared: 'true',
                rows: [{ amount: 100, instalmentAmount: 100, claimNumber: 'abc' }]
            });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.claimNumber).to.eq('abc');
            chai_1.expect(populatedItem.amount).to.eq(100);
            chai_1.expect(populatedItem.instalmentAmount).to.eq(100);
            expectAllRowsToBeEmpty(actual.rows);
        });
    });
    describe('createEmptyRow', () => {
        it('should create CourtOrderRow object with empty fields', () => {
            const emptyItem = new courtOrders_1.CourtOrders().createEmptyRow();
            chai_1.expect(emptyItem.isEmpty()).to.be.eq(true);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when declared = false', () => {
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(false, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and one valid row given', () => {
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [new courtOrderRow_1.CourtOrderRow(100, 100, 'abc')]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and many valid row given', () => {
                const o = new courtOrderRow_1.CourtOrderRow(100, 100, 'abc'); // valid row
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [o, o, o, o, o, o, o, o, o, o, o, o]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and one valid row and many many empty ones given', () => {
                const o = courtOrderRow_1.CourtOrderRow.empty();
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [o, o, new courtOrderRow_1.CourtOrderRow(1, 1, 'abc'), o, o, o, o]));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when declared = true and empty list of rows', () => {
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, []));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, courtOrders_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
            });
            it('when declared = true and invalid row given', () => {
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [new courtOrderRow_1.CourtOrderRow(100, -100, '')]));
                chai_1.expect(errors.length).to.equal(1);
            });
            it('when declared = true and many invalid row given', () => {
                const o = new courtOrderRow_1.CourtOrderRow(-100, -100, 'abc'); // invalid row
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [o, o, o, o, o, o, o, o, o, o, o, o]));
                chai_1.expect(errors.length).to.equal(1);
            });
            it('when declared = true and many empty rows and one invalid given', () => {
                const o = courtOrderRow_1.CourtOrderRow.empty();
                const errors = validator.validateSync(new courtOrders_1.CourtOrders(true, [o, o, o, o, o, new courtOrderRow_1.CourtOrderRow(-100, -100, 'abc'), o]));
                chai_1.expect(errors.length).to.equal(1);
            });
        });
    });
});
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(courtOrderRow_1.CourtOrderRow);
        chai_1.expect(item.isEmpty()).to.eq(true);
    });
}
