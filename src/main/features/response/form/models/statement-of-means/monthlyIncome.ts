import { ValidateNested } from 'class-validator'

import { MonthlyIncomeSource } from './monthlyIncomeSource'

export class SourceNames {
  static readonly SALARY = 'Income from your job'
  static readonly UNIVERSAL_CREDIT = 'Universal Credit'
  static readonly JOBSEEKER_ALLOWANE_INCOME = 'Jobseeker’s Allowance (income based)'
  static readonly JOBSEEKER_ALLOWANE_CONTRIBUTION = 'Jobseeker’s Allowance (contribution based)'
  static readonly INCOME_SUPPORT = 'Income Support'
  static readonly WORKING_TAX_CREDIT = 'Working Tax Credit'
  static readonly CHILD_TAX_CREDIT = 'Child Tax Credit'
  static readonly CHILD_BENEFIT = 'Child Benefit'
  static readonly COUNCIL_TAX_SUPPORT = 'Council Tax Support'
  static readonly PENSION = 'Pension (paid to you)'
}

export class MonthlyIncome {

  @ValidateNested()
  salarySource?: MonthlyIncomeSource

  @ValidateNested()
  universalCreditSource?: MonthlyIncomeSource

  @ValidateNested()
  jobseekerAllowanceIncomeSource?: MonthlyIncomeSource

  @ValidateNested()
  jobseekerAllowanceContributionSource?: MonthlyIncomeSource

  @ValidateNested()
  incomeSupportSource?: MonthlyIncomeSource

  @ValidateNested()
  workingTaxCreditSource?: MonthlyIncomeSource

  @ValidateNested()
  childTaxCreditSource?: MonthlyIncomeSource

  @ValidateNested()
  childBenefitSource?: MonthlyIncomeSource

  @ValidateNested()
  councilTaxSupportSource?: MonthlyIncomeSource

  @ValidateNested()
  pensionSource?: MonthlyIncomeSource

  constructor (
    salarySource?: MonthlyIncomeSource,
    universalCreditSource?: MonthlyIncomeSource,
    jobseekerAllowanceIncomeSource?: MonthlyIncomeSource,
    jobseekerAllowanceContributionSource?: MonthlyIncomeSource,
    incomeSupportSource?: MonthlyIncomeSource,
    workingTaxCreditSource?: MonthlyIncomeSource,
    childTaxCreditSource?: MonthlyIncomeSource,
    childBenefitSource?: MonthlyIncomeSource,
    councilTaxSupportSource?: MonthlyIncomeSource,
    pensionSource?: MonthlyIncomeSource
  ) {
    this.salarySource = salarySource
    this.universalCreditSource = universalCreditSource
    this.jobseekerAllowanceIncomeSource = jobseekerAllowanceIncomeSource
    this.jobseekerAllowanceContributionSource = jobseekerAllowanceContributionSource
    this.incomeSupportSource = incomeSupportSource
    this.workingTaxCreditSource = workingTaxCreditSource
    this.childTaxCreditSource = childTaxCreditSource
    this.childBenefitSource = childBenefitSource
    this.councilTaxSupportSource = councilTaxSupportSource
    this.pensionSource = pensionSource
  }

  static fromObject (value?: any): MonthlyIncome {
    if (!value) {
      return value
    }

    return new MonthlyIncome(
      MonthlyIncomeSource.fromObject(SourceNames.SALARY, value.salarySource, value.salarySourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.UNIVERSAL_CREDIT, value.universalCreditSource, value.universalCreditSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANE_INCOME, value.jobseekerAllowanceIncomeSource, value.jobseekerAllowanceIncomeDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, value.jobseekerAllowanceContributionSource, value.jobseekerAllowanceContributionSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.INCOME_SUPPORT, value.incomeSupportSource, value.incomeSupportSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.WORKING_TAX_CREDIT, value.workingTaxCreditSource, value.workingTaxCreditSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.CHILD_TAX_CREDIT, value.childTaxCreditSource, value.childTaxCreditSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.CHILD_BENEFIT, value.childBenefitSource, value.childBenefitSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.COUNCIL_TAX_SUPPORT, value.councilTaxSupportSource, value.councilTaxSupportSourceDeclared),
      MonthlyIncomeSource.fromObject(SourceNames.PENSION, value.pensionSource, value.pensionSourceDeclared)
    )
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.salarySource = input.salarySource
      this.universalCreditSource = input.universalCreditSource
      this.jobseekerAllowanceIncomeSource = input.jobseekerAllowanceIncomeSource
      this.jobseekerAllowanceContributionSource = input.jobseekerAllowanceContributionSource
      this.incomeSupportSource = input.incomeSupportSource
      this.workingTaxCreditSource = input.workingTaxCreditSource
      this.childTaxCreditSource = input.childTaxCreditSource
      this.childBenefitSource = input.childBenefitSource
      this.councilTaxSupportSource = input.councilTaxSupportSource
      this.pensionSource = input.pensionSource
    }

    return this
  }
}
