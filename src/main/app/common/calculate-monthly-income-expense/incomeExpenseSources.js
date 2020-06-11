"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("@hmcts/class-validator");
const incomeExpenseSource_1 = require("common/calculate-monthly-income-expense/incomeExpenseSource");
class IncomeExpenseSources {
    constructor(incomeExpenseSources) {
        this.incomeExpenseSources = incomeExpenseSources;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        if (!Array.isArray(value.incomeExpenseSources)) {
            throw new Error('Invalid value: missing array');
        }
        return new IncomeExpenseSources(value.incomeExpenseSources.map(incomeExpenseSource => incomeExpenseSource_1.IncomeExpenseSource.fromObject(incomeExpenseSource)));
    }
    static fromMonthlyExpensesFormModel(monthlyExpenses) {
        if (!monthlyExpenses) {
            return undefined;
        }
        const incomeExpenseSources = [];
        if (monthlyExpenses.mortgage && monthlyExpenses.mortgage.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.mortgage));
        }
        if (monthlyExpenses.rent && monthlyExpenses.rent.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.rent));
        }
        if (monthlyExpenses.councilTax && monthlyExpenses.councilTax.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.councilTax));
        }
        if (monthlyExpenses.gas && monthlyExpenses.gas.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.gas));
        }
        if (monthlyExpenses.electricity && monthlyExpenses.electricity.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.electricity));
        }
        if (monthlyExpenses.water && monthlyExpenses.water.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.water));
        }
        if (monthlyExpenses.travel && monthlyExpenses.travel.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.travel));
        }
        if (monthlyExpenses.schoolCosts && monthlyExpenses.schoolCosts.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.schoolCosts));
        }
        if (monthlyExpenses.foodAndHousekeeping && monthlyExpenses.foodAndHousekeeping.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.foodAndHousekeeping));
        }
        if (monthlyExpenses.tvAndBroadband && monthlyExpenses.tvAndBroadband.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.tvAndBroadband));
        }
        if (monthlyExpenses.hirePurchase && monthlyExpenses.hirePurchase.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.hirePurchase));
        }
        if (monthlyExpenses.mobilePhone && monthlyExpenses.mobilePhone.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.mobilePhone));
        }
        if (monthlyExpenses.maintenance && monthlyExpenses.maintenance.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(monthlyExpenses.maintenance));
        }
        if (monthlyExpenses.anyOtherPopulated) {
            incomeExpenseSources.push(...monthlyExpenses.other
                .filter(source => source.populated)
                .map(source => incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(source)));
        }
        return new IncomeExpenseSources(incomeExpenseSources);
    }
    static fromMonthlyIncomeFormModel(monthlyIncome) {
        if (!monthlyIncome) {
            return undefined;
        }
        const incomeExpenseSources = [];
        if (monthlyIncome.salarySource && monthlyIncome.salarySource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.salarySource));
        }
        if (monthlyIncome.universalCreditSource && monthlyIncome.universalCreditSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.universalCreditSource));
        }
        if (monthlyIncome.jobseekerAllowanceIncomeSource && monthlyIncome.jobseekerAllowanceIncomeSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.jobseekerAllowanceIncomeSource));
        }
        if (monthlyIncome.jobseekerAllowanceContributionSource && monthlyIncome.jobseekerAllowanceContributionSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.jobseekerAllowanceContributionSource));
        }
        if (monthlyIncome.incomeSupportSource && monthlyIncome.incomeSupportSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.incomeSupportSource));
        }
        if (monthlyIncome.workingTaxCreditSource && monthlyIncome.workingTaxCreditSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.workingTaxCreditSource));
        }
        if (monthlyIncome.childTaxCreditSource && monthlyIncome.childTaxCreditSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.childTaxCreditSource));
        }
        if (monthlyIncome.childBenefitSource && monthlyIncome.childBenefitSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.childBenefitSource));
        }
        if (monthlyIncome.councilTaxSupportSource && monthlyIncome.councilTaxSupportSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.councilTaxSupportSource));
        }
        if (monthlyIncome.pensionSource && monthlyIncome.pensionSource.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(monthlyIncome.pensionSource));
        }
        if (monthlyIncome.anyOtherIncomePopulated) {
            incomeExpenseSources.push(...monthlyIncome.otherSources
                .filter(source => source.populated)
                .map(source => incomeExpenseSource_1.IncomeExpenseSource.fromFormIncomeSource(source)));
        }
        return new IncomeExpenseSources(incomeExpenseSources);
    }
    static fromPriorityDebtModel(priorityDebt) {
        if (!priorityDebt) {
            return undefined;
        }
        const incomeExpenseSources = [];
        if (priorityDebt.mortgage && priorityDebt.mortgage.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.mortgage));
        }
        if (priorityDebt.rent && priorityDebt.rent.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.rent));
        }
        if (priorityDebt.councilTax && priorityDebt.councilTax.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.councilTax));
        }
        if (priorityDebt.gas && priorityDebt.gas.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.gas));
        }
        if (priorityDebt.electricity && priorityDebt.electricity.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.electricity));
        }
        if (priorityDebt.water && priorityDebt.water.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.water));
        }
        if (priorityDebt.maintenance && priorityDebt.maintenance.populated) {
            incomeExpenseSources.push(incomeExpenseSource_1.IncomeExpenseSource.fromFormExpenseSource(priorityDebt.maintenance));
        }
        return new IncomeExpenseSources(incomeExpenseSources);
    }
}
__decorate([
    class_validator_1.ValidateNested(),
    class_validator_1.IsArray()
], IncomeExpenseSources.prototype, "incomeExpenseSources", void 0);
exports.IncomeExpenseSources = IncomeExpenseSources;
