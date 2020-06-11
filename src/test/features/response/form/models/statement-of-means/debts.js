"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const debts_1 = require("response/form/models/statement-of-means/debts");
const debtRow_1 = require("response/form/models/statement-of-means/debtRow");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('Debts', () => {
    describe('on init', () => {
        it(`should create array of ${debts_1.INIT_ROW_COUNT} empty instances of DebtRow`, () => {
            const actual = (new debts_1.Debts()).rows;
            chai_1.expect(actual.length).to.equal(debts_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('deserialize', () => {
        it('should return empty object', () => {
            const actual = new debts_1.Debts().deserialize(undefined);
            chai_1.expect(actual).to.be.instanceof(debts_1.Debts);
            chai_1.expect(actual.declared).to.be.eq(undefined);
            chai_1.expect(actual.rows.length).to.eql(debts_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Debts with list of empty DebtRow[] when declared = false', () => {
            const actual = new debts_1.Debts().deserialize({ declared: false });
            chai_1.expect(actual.rows.length).to.eql(debts_1.INIT_ROW_COUNT);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Debts with first element on list populated', () => {
            const actual = new debts_1.Debts().deserialize({
                declared: true,
                rows: [
                    { debt: 'credit card', totalOwed: 100, monthlyPayments: 10 }
                ]
            });
            const populatedItem = actual.rows[0];
            chai_1.expect(populatedItem.debt).to.eq('credit card');
            chai_1.expect(populatedItem.totalOwed).to.eq(100);
            chai_1.expect(populatedItem.monthlyPayments).to.eq(10);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = debts_1.Debts.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return Debts with list of empty DebtRow[] when declared = false', () => {
            const actual = debts_1.Debts.fromObject({ declared: 'false' });
            chai_1.expect(actual.rows.length).to.eql(0);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Debts with first element on list populated', () => {
            const actual = debts_1.Debts.fromObject({
                declared: 'true',
                rows: [
                    { debt: 'credit card', totalOwed: '100', monthlyPayments: '10' }
                ]
            });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.debt).to.eq('credit card');
            chai_1.expect(populatedItem.totalOwed).to.eq(100);
            chai_1.expect(populatedItem.monthlyPayments).to.eq(10);
            expectAllRowsToBeEmpty(actual.rows);
        });
    });
    describe('createEmptyRow', () => {
        it('should create DebtRow object with empty fields', () => {
            const emptyItem = new debts_1.Debts().createEmptyRow();
            chai_1.expect(emptyItem.isEmpty()).to.be.eq(true);
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        context('should accept', () => {
            it('when declared = false', () => {
                const errors = validator.validateSync(new debts_1.Debts(false, undefined));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and one valid row given', () => {
                const errors = validator.validateSync(new debts_1.Debts(true, [new debtRow_1.DebtRow('my card', 100, 10)]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and many valid row given', () => {
                const o = new debtRow_1.DebtRow('my card', 100, 10); // valid row
                const errors = validator.validateSync(new debts_1.Debts(true, [o, o, o, o, o, o, o, o, o, o, o, o]));
                chai_1.expect(errors.length).to.equal(0);
            });
            it('when declared = true and one valid row and many many empty ones given', () => {
                const o = debtRow_1.DebtRow.empty();
                const errors = validator.validateSync(new debts_1.Debts(true, [o, o, o, o, new debtRow_1.DebtRow('card', 1, 1), o, o, o, o]));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
        context('should reject', () => {
            it('when declared = true and empty list of rows', () => {
                const errors = validator.validateSync(new debts_1.Debts(true, []));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, debts_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
            });
            it('when declared = true and invalid row given', () => {
                const errors = validator.validateSync(new debts_1.Debts(true, [new debtRow_1.DebtRow('', 100, 10)]));
                chai_1.expect(errors.length).to.equal(1);
            });
            it('when declared = true and many invalid row given', () => {
                const o = new debtRow_1.DebtRow('my card', -100, 10); // invalid row
                const errors = validator.validateSync(new debts_1.Debts(true, [o, o, o, o, o, o, o, o, o, o, o, o]));
                chai_1.expect(errors.length).to.equal(1);
            });
            it('when declared = true and many empty rows and one invalid given', () => {
                const o = debtRow_1.DebtRow.empty();
                const errors = validator.validateSync(new debts_1.Debts(true, [o, o, o, o, o, o, new debtRow_1.DebtRow('my card', -100, 10), o]));
                chai_1.expect(errors.length).to.equal(1);
            });
        });
    });
});
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(debtRow_1.DebtRow);
        chai_1.expect(item.isEmpty()).to.eq(true);
    });
}
