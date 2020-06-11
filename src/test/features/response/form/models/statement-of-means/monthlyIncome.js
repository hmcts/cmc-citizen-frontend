"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const class_validator_1 = require("@hmcts/class-validator");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const monthlyIncome_1 = require("response/form/models/statement-of-means/monthlyIncome");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
const incomeSource_1 = require("response/form/models/statement-of-means/incomeSource");
function getSampleMonthlyIncomeObject(options) {
    const DEFAULT_SAMPLE_VALID_MONTHLY_INCOME = {
        salarySource: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        universalCreditSource: {
            amount: 200,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        jobseekerAllowanceIncomeSource: {
            amount: 300,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        jobseekerAllowanceContributionSource: {
            amount: 400,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        incomeSupportSource: {
            amount: 500,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        workingTaxCreditSource: {
            amount: 600,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        childTaxCreditSource: {
            amount: 700,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        childBenefitSource: {
            amount: 800,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH
        },
        councilTaxSupportSource: {
            amount: 900,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        },
        pensionSource: {
            amount: 100,
            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS
        }
    };
    const sampleData = Object.assign({}, DEFAULT_SAMPLE_VALID_MONTHLY_INCOME, options || {});
    return {
        sampleData,
        forConstructor: forConstructor,
        forFromObjectMethod: forFromObjectMethod,
        forDeserialize: forDeserialize
    };
}
function forConstructor() {
    return new monthlyIncome_1.MonthlyIncome(undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, this.sampleData.salarySource.amount, this.sampleData.salarySource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, this.sampleData.universalCreditSource.amount, this.sampleData.universalCreditSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, this.sampleData.jobseekerAllowanceIncomeSource.amount, this.sampleData.jobseekerAllowanceIncomeSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, this.sampleData.jobseekerAllowanceContributionSource.amount, this.sampleData.jobseekerAllowanceContributionSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, this.sampleData.incomeSupportSource.amount, this.sampleData.incomeSupportSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, this.sampleData.workingTaxCreditSource.amount, this.sampleData.workingTaxCreditSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, this.sampleData.childTaxCreditSource.amount, this.sampleData.childTaxCreditSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, this.sampleData.childBenefitSource.amount, this.sampleData.childBenefitSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, this.sampleData.councilTaxSupportSource.amount, this.sampleData.councilTaxSupportSource.schedule), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, this.sampleData.pensionSource.amount, this.sampleData.pensionSource.schedule));
}
function forFromObjectMethod() {
    return {
        salarySourceDeclared: this.sampleData.salarySourceDeclared,
        salarySource: {
            amount: this.sampleData.salarySource.amount,
            schedule: this.sampleData.salarySource.schedule.value
        },
        universalCreditSourceDeclared: this.sampleData.universalCreditSourceDeclared,
        universalCreditSource: {
            amount: this.sampleData.universalCreditSource.amount,
            schedule: this.sampleData.universalCreditSource.schedule.value
        },
        jobseekerAllowanceIncomeSourceDeclared: this.sampleData.jobseekerAllowanceIncomeSourceDeclared,
        jobseekerAllowanceIncomeSource: {
            amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
            schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule.value
        },
        jobseekerAllowanceContributionSourceDeclared: this.sampleData.jobseekerAllowanceContributionSourceDeclared,
        jobseekerAllowanceContributionSource: {
            amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
            schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule.value
        },
        incomeSupportSourceDeclared: this.sampleData.incomeSupportSourceDeclared,
        incomeSupportSource: {
            amount: this.sampleData.incomeSupportSource.amount,
            schedule: this.sampleData.incomeSupportSource.schedule.value
        },
        workingTaxCreditSourceDeclared: this.sampleData.workingTaxCreditSourceDeclared,
        workingTaxCreditSource: {
            amount: this.sampleData.workingTaxCreditSource.amount,
            schedule: this.sampleData.workingTaxCreditSource.schedule.value
        },
        childTaxCreditSourceDeclared: this.sampleData.childTaxCreditSourceDeclared,
        childTaxCreditSource: {
            amount: this.sampleData.childTaxCreditSource.amount,
            schedule: this.sampleData.childTaxCreditSource.schedule.value
        },
        childBenefitSourceDeclared: this.sampleData.childBenefitSourceDeclared,
        childBenefitSource: {
            amount: this.sampleData.childBenefitSource.amount,
            schedule: this.sampleData.childBenefitSource.schedule.value
        },
        councilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
        councilTaxSupportSource: {
            amount: this.sampleData.councilTaxSupportSource.amount,
            schedule: this.sampleData.councilTaxSupportSource.schedule.value
        },
        pensionSourceDeclared: this.sampleData.pensionSourceDeclared,
        pensionSource: {
            amount: this.sampleData.pensionSource.amount,
            schedule: this.sampleData.pensionSource.schedule.value
        }
    };
}
function forDeserialize() {
    return {
        salarySourceDeclared: this.sampleData.salarySourceDeclared,
        salarySource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue,
            amount: this.sampleData.salarySource.amount,
            schedule: this.sampleData.salarySource.schedule
        },
        universalCreditSourceDeclared: this.sampleData.universalCreditSourceDeclared,
        universalCreditSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue,
            amount: this.sampleData.universalCreditSource.amount,
            schedule: this.sampleData.universalCreditSource.schedule
        },
        jobseekerAllowanceIncomeSourceDeclared: this.sampleData.jobseekerAllowanceIncomeSourceDeclared,
        jobseekerAllowanceIncomeSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue,
            amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
            schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule
        },
        jobseekerAllowanceContributionSourceDeclared: this.sampleData.jobseekerAllowanceContributionSourceDeclared,
        jobseekerAllowanceContributionSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue,
            amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
            schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule
        },
        incomeSupportSourceDeclared: this.sampleData.incomeSupportSourceDeclared,
        incomeSupportSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue,
            amount: this.sampleData.incomeSupportSource.amount,
            schedule: this.sampleData.incomeSupportSource.schedule
        },
        workingTaxCreditSourceDeclared: this.sampleData.workingTaxCreditSourceDeclared,
        workingTaxCreditSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue,
            amount: this.sampleData.workingTaxCreditSource.amount,
            schedule: this.sampleData.workingTaxCreditSource.schedule
        },
        childTaxCreditSourceDeclared: this.sampleData.childTaxCreditSourceDeclared,
        childTaxCreditSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue,
            amount: this.sampleData.childTaxCreditSource.amount,
            schedule: this.sampleData.childTaxCreditSource.schedule
        },
        childBenefitSourceDeclared: this.sampleData.childBenefitSourceDeclared,
        childBenefitSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue,
            amount: this.sampleData.childBenefitSource.amount,
            schedule: this.sampleData.childBenefitSource.schedule
        },
        councilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
        councilTaxSupportSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue,
            amount: this.sampleData.councilTaxSupportSource.amount,
            schedule: this.sampleData.councilTaxSupportSource.schedule
        },
        pensionSourceDeclared: this.sampleData.pensionSourceDeclared,
        pensionSource: {
            name: monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue,
            amount: this.sampleData.pensionSource.amount,
            schedule: this.sampleData.pensionSource.schedule
        },
        otherSources: [{}]
    };
}
describe('MonthlyIncome', () => {
    describe('fromObject', () => {
        it('should return undefined when undefined provided as object parameter', () => {
            chai_1.expect(monthlyIncome_1.MonthlyIncome.fromObject(undefined)).to.eql(undefined);
        });
        it('should return undefined when no object parameter provided', () => {
            chai_1.expect(monthlyIncome_1.MonthlyIncome.fromObject()).to.deep.equal(undefined);
        });
        it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
            chai_1.expect(monthlyIncome_1.MonthlyIncome.fromObject({})).to.deep.equal(new monthlyIncome_1.MonthlyIncome(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined));
        });
        it('should return a new instance initialised with set fields from object parameter provided', () => {
            const sampleMonthlyIncomeData = getSampleMonthlyIncomeObject().forFromObjectMethod();
            const expectedMonthlyIncomeObject = getSampleMonthlyIncomeObject().forConstructor();
            chai_1.expect(monthlyIncome_1.MonthlyIncome.fromObject(sampleMonthlyIncomeData)).to.deep.equal(expectedMonthlyIncomeObject);
        });
    });
    describe('deserialize', () => {
        it('should return instance initialised with defaults when undefined provided', () => {
            chai_1.expect(new monthlyIncome_1.MonthlyIncome().deserialize(undefined)).to.deep.equal(new monthlyIncome_1.MonthlyIncome());
        });
        it('should return instance initialised with set fields from object provided', () => {
            chai_1.expect(new monthlyIncome_1.MonthlyIncome().deserialize(getSampleMonthlyIncomeObject().forDeserialize())).to.deep.equal(getSampleMonthlyIncomeObject().forConstructor());
        });
    });
    describe('validation', () => {
        const validator = new class_validator_1.Validator();
        describe('when not successful', () => {
            it('should return errors when `IncomeSource` objects are invalid', () => {
                const errors = validator.validateSync(new monthlyIncome_1.MonthlyIncome(undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, -200, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, -300, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, -400, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, -500, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, -600, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, -700, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, -800, incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, -900, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS), undefined, new incomeSource_1.IncomeSource(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, -100, incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS)));
                chai_1.expect(errors.length).to.equal(10);
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue));
                validationUtils_1.expectValidationError(errors, incomeSource_1.ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue));
            });
        });
        describe('when successful', () => {
            it('should return no error when `hasSource` is true and `source` is invalid', () => {
                const sampleMonthlyIncomeData = getSampleMonthlyIncomeObject().forFromObjectMethod();
                const errors = validator.validateSync(sampleMonthlyIncomeData);
                chai_1.expect(errors.length).to.equal(0);
            });
        });
    });
});
