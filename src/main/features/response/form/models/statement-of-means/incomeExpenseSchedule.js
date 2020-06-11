"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IncomeExpenseSchedule {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
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
        return IncomeExpenseSchedule.all()
            .filter(item => item.value === value)
            .pop();
    }
}
exports.IncomeExpenseSchedule = IncomeExpenseSchedule;
IncomeExpenseSchedule.WEEK = new IncomeExpenseSchedule('WEEK', 'Week');
IncomeExpenseSchedule.TWO_WEEKS = new IncomeExpenseSchedule('TWO_WEEKS', '2 weeks');
IncomeExpenseSchedule.FOUR_WEEKS = new IncomeExpenseSchedule('FOUR_WEEKS', '4 weeks');
IncomeExpenseSchedule.MONTH = new IncomeExpenseSchedule('MONTH', 'Month');
