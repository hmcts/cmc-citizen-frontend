"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const employers_1 = require("response/form/models/statement-of-means/employers");
const employerRow_1 = require("response/form/models/statement-of-means/employerRow");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const class_validator_1 = require("@hmcts/class-validator");
describe('Employers', () => {
    describe('on init', () => {
        it('should create array of 1 empty instances of EmployerRow', () => {
            const actual = (new employers_1.Employers()).rows;
            chai_1.expect(actual.length).to.equal(1);
            expectAllRowsToBeEmpty(actual);
        });
    });
    describe('fromObject', () => {
        it('should return undefined value when undefined provided', () => {
            const actual = employers_1.Employers.fromObject(undefined);
            chai_1.expect(actual).to.eql(undefined);
        });
        it('should return Employers with list of empty EmployerRow[] when empty input given', () => {
            const actual = employers_1.Employers.fromObject([]);
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return Employers with first element on list populated', () => {
            const actual = employers_1.Employers.fromObject({ rows: [{ employerName: 'Comp', jobTitle: 'dev' }] });
            const populatedItem = actual.rows.pop();
            chai_1.expect(populatedItem.employerName).to.eq('Comp');
            chai_1.expect(populatedItem.jobTitle).to.eq('dev');
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return object with list of EmployerRow longer than default', () => {
            const actual = employers_1.Employers.fromObject({
                rows: [
                    { employerName: 'Comp1', jobTitle: 'dev' },
                    { employerName: 'Comp2', jobTitle: 'BA' },
                    { employerName: 'Comp3', jobTitle: 'PM' },
                    { employerName: 'Comp4', jobTitle: 'dev' },
                    { employerName: 'Comp5', jobTitle: 'UX' },
                    { employerName: 'Comp6', jobTitle: 'dev' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.greaterThan(actual.getInitialNumberOfRows());
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('deserialize', () => {
        it('should return valid Employers object with list of empty EmployerRow', () => {
            const actual = new employers_1.Employers().deserialize({});
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows());
            expectAllRowsToBeEmpty(actual.rows);
        });
        it('should return valid Employers object with populated first EmployerRow', () => {
            const actual = new employers_1.Employers().deserialize({ rows: [{ employerName: 'Comp', jobTitle: 'dev' }] });
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows());
            const populatedItem = actual.rows[0];
            chai_1.expect(populatedItem.employerName).to.eq('Comp');
            chai_1.expect(populatedItem.jobTitle).to.eq('dev');
            expectAllRowsToBeEmpty(actual.rows.slice(1));
        });
        it('should return valid Employers object with list of row longer than default length', () => {
            const actual = new employers_1.Employers().deserialize({
                rows: [
                    { employerName: 'Comp1', jobTitle: 'dev' },
                    { employerName: 'Comp2', jobTitle: 'dev' },
                    { employerName: 'Comp3', jobTitle: 'dev' },
                    { employerName: 'Comp4', jobTitle: 'dev' },
                    { employerName: 'Comp5', jobTitle: 'dev' }
                ]
            });
            expectAllRowsToBePopulated(actual.rows);
        });
    });
    describe('appendRow', () => {
        it('adds empty element to list of rows', () => {
            const actual = new employers_1.Employers();
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows());
            actual.appendRow();
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows() + 1);
        });
        it('adds only up to 20 elements', () => {
            const actual = new employers_1.Employers();
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows());
            for (let i = 0; i < actual.getMaxNumberOfRows() + 1; i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.rows.length).to.be.eq(actual.getMaxNumberOfRows());
        });
    });
    describe('removeExcessRows', () => {
        it('should filter out all elements from list when empty', () => {
            const actual = new employers_1.Employers();
            chai_1.expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows());
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(0);
        });
        it('should not filter out any element from list when all populated', () => {
            const actual = new employers_1.Employers().deserialize({
                rows: [
                    { employerName: 'Comp1', jobTitle: 'BA' },
                    { employerName: 'Comp2', jobTitle: 'UX' },
                    { employerName: 'Comp3', jobTitle: 'dev' },
                    { employerName: 'Comp4', jobTitle: 'PM' },
                    { employerName: 'Comp5', jobTitle: 'janitor' }
                ]
            });
            chai_1.expect(actual.rows.length).to.be.eq(5);
            actual.removeExcessRows();
            chai_1.expect(actual.rows.length).to.be.eq(5);
            expectAllRowsToBePopulated(actual.rows);
        });
        it('should filter out some elements from list when some of them are populated', () => {
            const actual = new employers_1.Employers().deserialize({
                rows: [
                    { employerName: 'Comp1', jobTitle: 'BA' },
                    { employerName: 'Comp2', jobTitle: 'UX' },
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
            const actual = new employers_1.Employers().deserialize({
                rows: [
                    { employerName: 'Comp1', jobTitle: 'BA' },
                    {},
                    { employerName: 'Comp2', jobTitle: 'UX' },
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
            const actual = new employers_1.Employers();
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(true);
        });
        it('should return true when number of rows is equal max', () => {
            const actual = new employers_1.Employers();
            for (let i = 0; i < actual.getMaxNumberOfRows(); i++) {
                actual.appendRow();
            }
            chai_1.expect(actual.canAddMoreRows()).to.be.eq(false);
        });
    });
    describe('validate', () => {
        const validator = new class_validator_1.Validator();
        context('should reject when ', () => {
            it('0 rows given', () => {
                const errors = validator.validateSync(new employers_1.Employers([]));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, employers_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
            });
            it('more than 0 empty rows given', () => {
                const errors = validator.validateSync(new employers_1.Employers([employerRow_1.EmployerRow.empty(), employerRow_1.EmployerRow.empty()]));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, employers_1.ValidationErrors.ENTER_AT_LEAST_ONE_ROW);
            });
            it('more than 0 invalid rows given', () => {
                const errors = validator.validateSync(new employers_1.Employers([new employerRow_1.EmployerRow('company', undefined)]));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, employerRow_1.ValidationErrors.JOB_TITLE_REQUIRED);
            });
        });
        context('should accept when', () => {
            it('at least one valid row given', () => {
                const errors = validator.validateSync(new employers_1.Employers([new employerRow_1.EmployerRow('company', 'dev')]));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
function expectAllRowsToBeEmpty(rows) {
    rows.forEach(item => {
        chai_1.expect(item).instanceof(employerRow_1.EmployerRow);
        chai_1.expect(item.jobTitle).to.eq(undefined);
        chai_1.expect(item.employerName).to.eq(undefined);
    });
}
function expectAllRowsToBePopulated(rows) {
    rows.forEach(item => {
        chai_1.expect(!!item.jobTitle).to.eq(true);
        chai_1.expect(!!item.employerName).to.eq(true);
    });
}
