"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const incomeSource_1 = require("response/form/models/statement-of-means/incomeSource");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const SAMPLE_MONTHLY_INCOME_SOURCE_FROM_OBJECT = {
    amount: 100,
    schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
};
const SAMPLE_MONTHLY_INCOME_SOURCE_DESERIALIZE = {
    name: 'name',
    amount: 100,
    schedule: {
        value: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value,
        displayValue: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.displayValue
    }
};
describe('IncomeSource', () => {
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeSource_1.IncomeSource.fromObject('name', undefined)).to.eql(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(incomeSource_1.IncomeSource.fromObject('name')).to.deep.equal(undefined);
        });
        it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
            chai_1.expect(incomeSource_1.IncomeSource.fromObject('name', {})).to.deep.equal(new incomeSource_1.IncomeSource('name'));
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            chai_1.expect(incomeSource_1.IncomeSource.fromObject('name', SAMPLE_MONTHLY_INCOME_SOURCE_FROM_OBJECT)).to.deep.equal(new incomeSource_1.IncomeSource('name', 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
        });
        it('should return a new instance initialised with name set to undefined', () => {
            chai_1.expect(incomeSource_1.IncomeSource.fromObject(undefined)).to.eql(undefined, undefined);
        });
    });
    describe('deserialize', () => {
        it('should return instance initialised with defaults when undefined provided', () => {
            chai_1.expect(new incomeSource_1.IncomeSource('name').deserialize(undefined)).to.deep.equal(new incomeSource_1.IncomeSource('name'));
        });
        it('should return instance initialised with set fields from object provided', () => {
            chai_1.expect(new incomeSource_1.IncomeSource('name').deserialize(SAMPLE_MONTHLY_INCOME_SOURCE_DESERIALIZE)).to.deep.equal(new incomeSource_1.IncomeSource('name', 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when not successful', () => {
            it('should return errors when all expect `name` are undefined', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', undefined));
                chai_1.expect(errors.length).to.equal(2);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_REQUIRED('Source name'));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'));
            });
            it('should return an error when `amount` is undefined', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', undefined, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_REQUIRED('Source name'));
            });
            it('should return an error when `amount` has invalid decimal amount', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', 0.123, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_INVALID_DECIMALS('Source name'));
            });
            it('should return an error when `amount` is negative', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED('Source name'));
            });
            it('should return an error when `schedule` is undefined', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', 100, undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'));
            });
            it('should return an error when `schedule` is invalid', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', 100, new incomeExpenseSchedule_1.IncomeExpenseSchedule('UNKNOWN', 'Unknown')));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.SCHEDULE_SELECT_AN_OPTION('Source name'));
            });
        });
        describe('when successful', () => {
            it('should return no error', () => {
                const errors = validator.validateSync(new incomeSource_1.IncomeSource('Source name', 100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
