"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const incomeExpenseSource_1 = require("common/calculate-monthly-income-expense/incomeExpenseSource");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("../../forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const incomeSource_1 = require("response/form/models/statement-of-means/incomeSource");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
const incomeExpenseSchedule_2 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
const SAMPLE_INCOME_EXPENSE_SOURCE_FROM_OBJECT = {
    amount: 100,
    schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
};
describe('IncomeExpenseSource', () => {
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromObject(undefined)).to.deep.equal(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromObject()).to.deep.equal(undefined);
        });
        it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromObject({})).to.deep.equal(new incomeExpenseSource_1.IncomeExpenseSource(undefined, undefined));
        });
        it('should return a new instance with defaults when amount and schedule are invalid', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromObject({
                'amount': 'INVALID',
                'schedule': 'UNKNOWN'
            })).to.deep.equal(new incomeExpenseSource_1.IncomeExpenseSource(undefined, undefined));
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromObject(SAMPLE_INCOME_EXPENSE_SOURCE_FROM_OBJECT)).to.deep.equal(new incomeExpenseSource_1.IncomeExpenseSource(100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
        });
    });
    describe('fromFormIncomeSource', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(undefined)).to.equal(undefined);
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const monthlyIncome = new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH);
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome)).to.deep.equal({
                'amount': 100,
                'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
            });
        });
    });
    describe('fromFormExpenseSource', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(undefined)).to.equal(undefined);
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const monthlyExpense = new expenseSource_1.ExpenseSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH);
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpense)).to.deep.equal({
                'amount': 100,
                'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
            });
        });
    });
    describe('fromClaimIncome', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromClaimIncome(undefined)).to.equal(undefined);
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const income = {
                amount: 200,
                frequency: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value,
                type: monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue
            };
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromClaimIncome(income)).to.deep.equal({
                amount: 200,
                schedule: {
                    value: 'WEEK',
                    valueInMonths: 4.333333333333333
                }
            });
        });
    });
    describe('fromClaimExpense', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromClaimExpense(undefined)).to.equal(undefined);
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const expense = {
                amount: 200,
                frequency: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value,
                type: monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue
            };
            chai_1.expect(incomeExpenseSource_1.IncomeExpenseSource.fromClaimExpense(expense)).to.deep.equal({
                amount: 200,
                schedule: {
                    value: 'MONTH',
                    valueInMonths: 1
                }
            });
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when not successful', () => {
            it('should return an error when `amount` is undefined', () => {
                const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(undefined, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NUMBER_REQUIRED);
            });
            it('should return an error when `amount` has invalid decimal amount', () => {
                const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(0.123, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS);
            });
            it('should return an error when `amount` is negative', () => {
                const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(-100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            it('should return an error when `schedule` is undefined', () => {
                const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(100, undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
            });
            it('should return an error when `schedule` is invalid', () => {
                const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(100, new incomeExpenseSchedule_1.IncomeExpenseSchedule('UNKNOWN', 1)));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.SELECT_AN_OPTION);
            });
            describe('when successful', () => {
                it('should return no error', () => {
                    const errors = validator.validateSync(new incomeExpenseSource_1.IncomeExpenseSource(100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
