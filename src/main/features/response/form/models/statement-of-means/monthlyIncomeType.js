"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonthlyIncomeType {
    constructor(value, displayValue) {
        this.value = value;
        this.displayValue = displayValue;
    }
    static all() {
        return [
            MonthlyIncomeType.JOB,
            MonthlyIncomeType.UNIVERSAL_CREDIT,
            MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES,
            MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED,
            MonthlyIncomeType.INCOME_SUPPORT,
            MonthlyIncomeType.WORKING_TAX_CREDIT,
            MonthlyIncomeType.CHILD_TAX_CREDIT,
            MonthlyIncomeType.CHILD_BENEFIT,
            MonthlyIncomeType.COUNCIL_TAX_SUPPORT,
            MonthlyIncomeType.PENSION,
            MonthlyIncomeType.OTHER
        ];
    }
    static valueOf(value) {
        return MonthlyIncomeType.all()
            .filter(type => type.value === value)
            .pop();
    }
}
exports.MonthlyIncomeType = MonthlyIncomeType;
MonthlyIncomeType.JOB = new MonthlyIncomeType('JOB', 'income from your job');
MonthlyIncomeType.UNIVERSAL_CREDIT = new MonthlyIncomeType('UNIVERSAL_CREDIT', 'Universal Credit');
MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES = new MonthlyIncomeType('JOB_SEEKERS_ALLOWANCE_INCOME_BASES', 'Jobseeker’s Allowance (income based)');
MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED = new MonthlyIncomeType('JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED', 'Jobseeker’s Allowance (contribution based)');
MonthlyIncomeType.INCOME_SUPPORT = new MonthlyIncomeType('INCOME_SUPPORT', 'Income Support');
MonthlyIncomeType.WORKING_TAX_CREDIT = new MonthlyIncomeType('WORKING_TAX_CREDIT', 'Working Tax Credit');
MonthlyIncomeType.CHILD_TAX_CREDIT = new MonthlyIncomeType('CHILD_TAX_CREDIT', 'Child Tax Credit');
MonthlyIncomeType.CHILD_BENEFIT = new MonthlyIncomeType('CHILD_BENEFIT', 'Child Benefit');
MonthlyIncomeType.COUNCIL_TAX_SUPPORT = new MonthlyIncomeType('COUNCIL_TAX_SUPPORT', 'Council Tax Support');
MonthlyIncomeType.PENSION = new MonthlyIncomeType('PENSION', 'pension');
MonthlyIncomeType.OTHER = new MonthlyIncomeType('OTHER', 'other');
