"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
describe('ExpenseSchedule', () => {
    describe('of', () => {
        it('should return valid object for valid input', () => {
            const incomeExpenseSchedule = incomeExpenseSchedule_1.IncomeExpenseSchedule.of(incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value);
            chai_1.expect(incomeExpenseSchedule instanceof incomeExpenseSchedule_1.IncomeExpenseSchedule).to.equal(true);
            chai_1.expect(incomeExpenseSchedule.value).to.equal(incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value);
            chai_1.expect(incomeExpenseSchedule.valueInMonths).to.equal(incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.valueInMonths);
        });
        it('should throw exception for invalid input', () => {
            try {
                incomeExpenseSchedule_1.IncomeExpenseSchedule.of('unknown');
            }
            catch (e) {
                chai_1.expect(e.message).to.equal(`There is no IncomeExpenseSchedule: 'unknown'`);
            }
        });
    });
});
