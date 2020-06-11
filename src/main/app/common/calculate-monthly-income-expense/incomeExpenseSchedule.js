"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IncomeExpenseSchedule {
    constructor(value, valueInMonths) {
        this.value = value;
        this.valueInMonths = valueInMonths;
    }
    static all() {
        return [
            IncomeExpenseSchedule.WEEK,
            IncomeExpenseSchedule.TWO_WEEKS,
            IncomeExpenseSchedule.FOUR_WEEKS,
            IncomeExpenseSchedule.MONTH
        ];
    }
    static of(value) {
        const result = IncomeExpenseSchedule.all().filter(item => item.value === value).pop();
        if (result) {
            return result;
        }
        throw new Error(`There is no IncomeExpenseSchedule: '${value}'`);
    }
}
exports.IncomeExpenseSchedule = IncomeExpenseSchedule;
IncomeExpenseSchedule.WEEK = new IncomeExpenseSchedule('WEEK', 52 / 12);
IncomeExpenseSchedule.TWO_WEEKS = new IncomeExpenseSchedule('TWO_WEEKS', 52 / 12 / 2);
IncomeExpenseSchedule.FOUR_WEEKS = new IncomeExpenseSchedule('FOUR_WEEKS', 52 / 12 / 4);
IncomeExpenseSchedule.MONTH = new IncomeExpenseSchedule('MONTH', 1);
