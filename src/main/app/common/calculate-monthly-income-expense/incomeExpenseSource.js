"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const numericUtils_1 = require("main/common/utils/numericUtils");
const validationErrors_1 = require("forms/validation/validationErrors");
const class_validator_1 = require("@hmcts/class-validator");
const cmc_validators_1 = require("@hmcts/cmc-validators");
class IncomeExpenseSource {
    constructor(amount, incomeExpenseSchedule) {
        this.amount = amount;
        this.schedule = incomeExpenseSchedule;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new IncomeExpenseSource(numericUtils_1.toNumberOrUndefined(value.amount), toIncomeExpenseScheduleOrUndefined(value.schedule));
    }
    static fromFormIncomeSource(incomeSource) {
        if (!incomeSource) {
            return undefined;
        }
        const schedule = incomeSource.schedule ? incomeSource.schedule.value : undefined;
        return new IncomeExpenseSource(numericUtils_1.toNumberOrUndefined(incomeSource.amount), toIncomeExpenseScheduleOrUndefined(schedule));
    }
    static fromFormExpenseSource(expenseSource) {
        if (!expenseSource) {
            return undefined;
        }
        const schedule = expenseSource.schedule ? expenseSource.schedule.value : undefined;
        return new IncomeExpenseSource(numericUtils_1.toNumberOrUndefined(expenseSource.amount), toIncomeExpenseScheduleOrUndefined(schedule));
    }
    static fromClaimIncome(income) {
        if (!income) {
            return undefined;
        }
        return new IncomeExpenseSource(numericUtils_1.toNumberOrUndefined(income.amount), toIncomeExpenseScheduleOrUndefined(income.frequency));
    }
    static fromClaimExpense(expense) {
        if (!expense) {
            return undefined;
        }
        return new IncomeExpenseSource(numericUtils_1.toNumberOrUndefined(expense.amount), toIncomeExpenseScheduleOrUndefined(expense.frequency));
    }
}
__decorate([
    class_validator_1.IsDefined({ message: validationErrors_1.ValidationErrors.NUMBER_REQUIRED }),
    cmc_validators_1.Fractions(0, 2, { message: validationErrors_1.ValidationErrors.AMOUNT_INVALID_DECIMALS }),
    class_validator_1.IsPositive({ message: validationErrors_1.ValidationErrors.POSITIVE_NUMBER_REQUIRED })
], IncomeExpenseSource.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsIn(incomeExpenseSchedule_1.IncomeExpenseSchedule.all(), { message: validationErrors_1.ValidationErrors.SELECT_AN_OPTION })
], IncomeExpenseSource.prototype, "schedule", void 0);
exports.IncomeExpenseSource = IncomeExpenseSource;
function toIncomeExpenseScheduleOrUndefined(value) {
    try {
        return incomeExpenseSchedule_1.IncomeExpenseSchedule.of(value);
    }
    catch (error) {
        return undefined;
    }
}
