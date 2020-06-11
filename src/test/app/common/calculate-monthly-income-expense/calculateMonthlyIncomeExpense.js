"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const calculateMonthlyIncomeExpense_1 = require("common/calculate-monthly-income-expense/calculateMonthlyIncomeExpense");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
describe('CalculateMonthlyIncomeExpense', () => {
    it('should calculate total amount using weekly schedule', () => {
        const incomeExpenseSource = [{ 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK }];
        chai_1.expect(calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSource))
            .to.equal(433.33);
    });
    it('should calculate total amount using biweekly schedule', () => {
        const incomeExpenseSource = [{ 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS }];
        chai_1.expect(calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSource))
            .to.equal(216.67);
    });
    it('should calculate total amount using four weekly schedule', () => {
        const incomeExpenseSource = [{ 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS }];
        chai_1.expect(calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSource))
            .to.equal(108.33);
    });
    it('should calculate total amount using monthly schedule', () => {
        const incomeExpenseSource = [{ 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH }];
        chai_1.expect(calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSource))
            .to.equal(100);
    });
    it('should calculate total amount using multiple amounts and different income or expense schedules', () => {
        const incomeExpenseSource = [
            { 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK },
            { 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS },
            { 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS },
            { 'amount': 100, 'schedule': incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH }
        ];
        chai_1.expect(calculateMonthlyIncomeExpense_1.CalculateMonthlyIncomeExpense
            .calculateTotalAmount(incomeExpenseSource)).to.equal(858.33);
    });
});
