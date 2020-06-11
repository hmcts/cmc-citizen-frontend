"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
describe('ExpenseSchedule', () => {
    describe('of', () => {
        incomeExpenseSchedule_1.IncomeExpenseSchedule.all().forEach(expectedIncomeExpenseSchedule => {
            it(`should return a valid object for '${expectedIncomeExpenseSchedule.value}'`, () => {
                const actualIncomeExpenseSchedule = incomeExpenseSchedule_1.IncomeExpenseSchedule.of(expectedIncomeExpenseSchedule.value);
                chai_1.expect(actualIncomeExpenseSchedule).to.be.instanceof(incomeExpenseSchedule_1.IncomeExpenseSchedule);
                chai_1.expect(actualIncomeExpenseSchedule.value).to.equal(expectedIncomeExpenseSchedule.value);
                chai_1.expect(actualIncomeExpenseSchedule.displayValue).to.equal(expectedIncomeExpenseSchedule.displayValue);
            });
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
