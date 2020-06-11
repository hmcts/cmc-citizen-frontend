"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const monthlyIncomeType_1 = require("./monthlyIncomeType");
const incomeSource_1 = require("./incomeSource");
const class_validator_1 = require("@hmcts/class-validator");
class MonthlyIncome {
    constructor(salarySourceDeclared, salarySource, universalCreditSourceDeclared, universalCreditSource, jobseekerAllowanceIncomeSourceDeclared, jobseekerAllowanceIncomeSource, jobseekerAllowanceContributionSourceDeclared, jobseekerAllowanceContributionSource, incomeSupportSourceDeclared, incomeSupportSource, workingTaxCreditSourceDeclared, workingTaxCreditSource, childTaxCreditSourceDeclared, childTaxCreditSource, childBenefitSourceDeclared, childBenefitSource, councilTaxSupportSourceDeclared, councilTaxSupportSource, pensionSourceDeclared, pensionSource, otherSourcesDeclared, otherSources = [new incomeSource_1.IncomeSource()]) {
        this.salarySourceDeclared = salarySourceDeclared;
        this.salarySource = salarySource;
        this.universalCreditSourceDeclared = universalCreditSourceDeclared;
        this.universalCreditSource = universalCreditSource;
        this.jobseekerAllowanceIncomeSourceDeclared = jobseekerAllowanceIncomeSourceDeclared;
        this.jobseekerAllowanceIncomeSource = jobseekerAllowanceIncomeSource;
        this.jobseekerAllowanceContributionSourceDeclared = jobseekerAllowanceContributionSourceDeclared;
        this.jobseekerAllowanceContributionSource = jobseekerAllowanceContributionSource;
        this.incomeSupportSourceDeclared = incomeSupportSourceDeclared;
        this.incomeSupportSource = incomeSupportSource;
        this.workingTaxCreditSourceDeclared = workingTaxCreditSourceDeclared;
        this.workingTaxCreditSource = workingTaxCreditSource;
        this.childTaxCreditSourceDeclared = childTaxCreditSourceDeclared;
        this.childTaxCreditSource = childTaxCreditSource;
        this.childBenefitSourceDeclared = childBenefitSourceDeclared;
        this.childBenefitSource = childBenefitSource;
        this.councilTaxSupportSourceDeclared = councilTaxSupportSourceDeclared;
        this.councilTaxSupportSource = councilTaxSupportSource;
        this.pensionSourceDeclared = pensionSourceDeclared;
        this.pensionSource = pensionSource;
        this.otherSourcesDeclared = otherSourcesDeclared;
        this.otherSources = otherSources;
    }
    static fromObject(value) {
        if (!value) {
            return value;
        }
        return new MonthlyIncome(value.salarySourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.JOB.displayValue, value.salarySource), value.universalCreditSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, value.universalCreditSource), value.jobseekerAllowanceIncomeSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, value.jobseekerAllowanceIncomeSource), value.jobseekerAllowanceContributionSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, value.jobseekerAllowanceContributionSource), value.incomeSupportSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.INCOME_SUPPORT.displayValue, value.incomeSupportSource), value.workingTaxCreditSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, value.workingTaxCreditSource), value.childTaxCreditSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, value.childTaxCreditSource), value.childBenefitSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.CHILD_BENEFIT.displayValue, value.childBenefitSource), value.councilTaxSupportSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, value.councilTaxSupportSource), value.pensionSourceDeclared, incomeSource_1.IncomeSource.fromObject(monthlyIncomeType_1.MonthlyIncomeType.PENSION.displayValue, value.pensionSource), value.otherSourcesDeclared, value.otherSources && value.otherSources
            .map(source => incomeSource_1.IncomeSource.fromObject(source.name, source))
            .filter(source => source !== undefined));
    }
    deserialize(input) {
        if (input) {
            this.salarySourceDeclared = input.salarySourceDeclared;
            this.salarySource = new incomeSource_1.IncomeSource().deserialize(input.salarySource);
            this.universalCreditSourceDeclared = input.universalCreditSourceDeclared;
            this.universalCreditSource = new incomeSource_1.IncomeSource().deserialize(input.universalCreditSource);
            this.jobseekerAllowanceIncomeSourceDeclared = input.jobseekerAllowanceIncomeSourceDeclared;
            this.jobseekerAllowanceIncomeSource = new incomeSource_1.IncomeSource().deserialize(input.jobseekerAllowanceIncomeSource);
            this.jobseekerAllowanceContributionSourceDeclared = input.jobseekerAllowanceContributionSourceDeclared;
            this.jobseekerAllowanceContributionSource = new incomeSource_1.IncomeSource().deserialize(input.jobseekerAllowanceContributionSource);
            this.incomeSupportSourceDeclared = input.incomeSupportSourceDeclared;
            this.incomeSupportSource = new incomeSource_1.IncomeSource().deserialize(input.incomeSupportSource);
            this.workingTaxCreditSourceDeclared = input.workingTaxCreditSourceDeclared;
            this.workingTaxCreditSource = new incomeSource_1.IncomeSource().deserialize(input.workingTaxCreditSource);
            this.childTaxCreditSourceDeclared = input.childTaxCreditSourceDeclared;
            this.childTaxCreditSource = new incomeSource_1.IncomeSource().deserialize(input.childTaxCreditSource);
            this.childBenefitSourceDeclared = input.childBenefitSourceDeclared;
            this.childBenefitSource = new incomeSource_1.IncomeSource().deserialize(input.childBenefitSource);
            this.councilTaxSupportSourceDeclared = input.councilTaxSupportSourceDeclared;
            this.councilTaxSupportSource = new incomeSource_1.IncomeSource().deserialize(input.councilTaxSupportSource);
            this.pensionSourceDeclared = input.pensionSourceDeclared;
            this.pensionSource = new incomeSource_1.IncomeSource().deserialize(input.pensionSource);
            this.otherSourcesDeclared = input.otherSourcesDeclared;
            this.otherSources = input.otherSources && input.otherSources.map(source => new incomeSource_1.IncomeSource().deserialize(source));
        }
        return this;
    }
    get anyOtherIncomePopulated() {
        return !!this.otherSources && this.otherSources.some(source => source.populated);
    }
    addEmptyOtherIncome() {
        this.otherSources.push(new incomeSource_1.IncomeSource());
    }
    removeOtherIncome(source) {
        this.otherSources.splice(this.otherSources.findIndex(element => element === source), 1);
    }
    resetIncome(propertyName, source) {
        this[`${propertyName.split('.')[0]}Declared`] = false;
        source.reset();
    }
}
__decorate([
    class_validator_1.ValidateIf((o) => o.salarySourceDeclared || (o.salarySource && o.salarySource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "salarySource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.universalCreditSourceDeclared || (o.universalCreditSource && o.universalCreditSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "universalCreditSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.jobseekerAllowanceIncomeSourceDeclared || (o.jobseekerAllowanceIncomeSource && o.jobseekerAllowanceIncomeSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "jobseekerAllowanceIncomeSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.jobseekerAllowanceContributionSourceDeclared || (o.jobseekerAllowanceContributionSource && o.jobseekerAllowanceContributionSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "jobseekerAllowanceContributionSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.incomeSupportSourceDeclared || (o.incomeSupportSource && o.incomeSupportSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "incomeSupportSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.workingTaxCreditSourceDeclared || (o.workingTaxCreditSource && o.workingTaxCreditSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "workingTaxCreditSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.childTaxCreditSourceDeclared || (o.childTaxCreditSource && o.childTaxCreditSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "childTaxCreditSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.childBenefitSourceDeclared || (o.childBenefitSource && o.childBenefitSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "childBenefitSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.councilTaxSupportSourceDeclared || (o.councilTaxSupportSource && o.councilTaxSupportSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "councilTaxSupportSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.pensionSourceDeclared || (o.pensionSource && o.pensionSource.populated)),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "pensionSource", void 0);
__decorate([
    class_validator_1.ValidateIf((o) => o.otherSourcesDeclared || o.anyOtherIncomePopulated),
    class_validator_1.ValidateNested()
], MonthlyIncome.prototype, "otherSources", void 0);
exports.MonthlyIncome = MonthlyIncome;
