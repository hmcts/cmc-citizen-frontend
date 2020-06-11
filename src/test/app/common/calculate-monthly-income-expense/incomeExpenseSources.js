"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const incomeExpenseSources_1 = require("common/calculate-monthly-income-expense/incomeExpenseSources");
const incomeExpenseSource_1 = require("common/calculate-monthly-income-expense/incomeExpenseSource");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const incomeExpenseSchedule_2 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("../../forms/models/validationUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const monthlyIncome_1 = require("response/form/models/statement-of-means/monthlyIncome");
const monthlyExpenses_1 = require("response/form/models/statement-of-means/monthlyExpenses");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
const incomeSource_1 = require("response/form/models/statement-of-means/incomeSource");
const expenseSource_1 = require("response/form/models/statement-of-means/expenseSource");
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
const priorityDebt_1 = require("response/form/models/statement-of-means/priorityDebt");
const SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT = {
    incomeExpenseSources: [
        {
            'amount': 100,
            'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
        }
    ]
};
describe('IncomeExpenseSources', () => {
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromObject(undefined)).to.eql(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromObject()).to.deep.equal(undefined);
        });
        it('should throw invalid array error when an empty object parameter is provided', () => {
            chai_1.expect(() => incomeExpenseSources_1.IncomeExpenseSources.fromObject({})).to.throw(Error, 'Invalid value: missing array');
        });
        it('should return a new instance initialised with defaults when an empty incomeExpenseSources array is provided', () => {
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromObject({ incomeExpenseSources: [] })).to.deep.equal(new incomeExpenseSources_1.IncomeExpenseSources([]));
        });
        it('should throw invalid array error when incomeExpenseSources provided is not an array', () => {
            chai_1.expect(() => incomeExpenseSources_1.IncomeExpenseSources.fromObject({ incomeExpenseSources: 'not an array' })).to.throw(Error, 'Invalid value: missing array');
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromObject(SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT)).to.deep.equal(new incomeExpenseSources_1.IncomeExpenseSources([
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                }
            ]));
        });
    });
    describe('fromMonthlyIncomeFormModel', () => {
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const monthlyIncome = new monthlyIncome_1.MonthlyIncome(undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, 200, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, 300, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, 400, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, 500, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, 600, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, 700, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, 800, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, 900, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS));
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromMonthlyIncomeFormModel(monthlyIncome)).to.deep.equal(new incomeExpenseSources_1.IncomeExpenseSources([
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 200,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 300,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 400,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 500,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 600,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 700,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 800,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 900,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                }
            ]));
        });
    });
    describe('fromMonthlyExpenseFormModel', () => {
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const monthlyExpenses = new monthlyExpenses_1.MonthlyExpenses(undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MORTGAGE.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.RENT.displayValue, 200, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.COUNCIL_TAX.displayValue, 300, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.GAS.displayValue, 400, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.ELECTRICITY.displayValue, 500, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.WATER.displayValue, 600, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TRAVEL.displayValue, 700, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.SCHOOL_COSTS.displayValue, 800, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, 900, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.TV_AND_BROADBAND.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.HIRE_PURCHASES.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MOBILE_PHONE.displayValue, 200, incomeExpenseSchedule_2.IncomeExpenseSchedule.MONTH), undefined, new expenseSource_1.ExpenseSource(monthlyExpenseType_1.MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, 300, incomeExpenseSchedule_2.IncomeExpenseSchedule.TWO_WEEKS));
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromMonthlyExpensesFormModel(monthlyExpenses)).to.deep.equal(new incomeExpenseSources_1.IncomeExpenseSources([
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 200,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 300,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 400,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 500,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 600,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 700,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 800,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 900,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                },
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 200,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                },
                {
                    'amount': 300,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
                }
            ]));
        });
    });
    describe('fromPriorityDebtModel', () => {
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const priorityDebt = new priorityDebt_1.PriorityDebt(true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MORTGAGE.displayValue, 100, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.RENT.displayValue, 200, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, 300, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.GAS.displayValue, 400, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.ELECTRICITY.displayValue, 500, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.WATER.displayValue, 600, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK), true, new expenseSource_1.ExpenseSource(priorityDebtType_1.PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, 700, incomeExpenseSchedule_2.IncomeExpenseSchedule.WEEK));
            chai_1.expect(incomeExpenseSources_1.IncomeExpenseSources.fromPriorityDebtModel(priorityDebt)).to.deep.equal(new incomeExpenseSources_1.IncomeExpenseSources([
                {
                    'amount': 100,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 200,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 300,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 400,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 500,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 600,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                },
                {
                    'amount': 700,
                    'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                }
            ]));
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when not successful', () => {
            it('should return an error when `incomeExpenseSources` is undefined', () => {
                const errors = validator.validateSync(new incomeExpenseSources_1.IncomeExpenseSources(undefined));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, 'incomeExpenseSources must be an array');
            });
            it('should return an error when `incomeExpenseSources` is invalid', () => {
                const invalidIncomeExpenseSource = new incomeExpenseSource_1.IncomeExpenseSource(undefined, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH);
                const errors = validator.validateSync(new incomeExpenseSources_1.IncomeExpenseSources([invalidIncomeExpenseSource]));
                chai_1.expect(errors.length).to.equal(1);
                validationUtils_1.expectValidationError(errors, validationErrors_1.ValidationErrors.NUMBER_REQUIRED &&
                    validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED);
            });
            describe('when successful', () => {
                it('should return no error when `incomeExpenseSources` is valid', () => {
                    const errors = validator.validateSync(new incomeExpenseSources_1.IncomeExpenseSources([
                        {
                            'amount': 100,
                            'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
                        },
                        {
                            'amount': 200,
                            'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK
                        }
                    ]));
                    chai_1.expect(errors.length).to.equal(0);
                });
                it('should return no error when `incomeExpenseSources` is an empty array', () => {
                    const errors = validator.validateSync(new incomeExpenseSources_1.IncomeExpenseSources([]));
                    chai_1.expect(errors.length).to.equal(0);
                });
            });
        });
    });
});
