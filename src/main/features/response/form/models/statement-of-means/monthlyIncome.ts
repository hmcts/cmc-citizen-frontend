import { ValidateIf, ValidateNested } from 'class-validator'

import { MonthlyIncomeSource } from './monthlyIncomeSource'

export class SourceNames {
  static readonly SALARY = 'Income from your job'
  static readonly UNIVERSAL_CREDIT = 'Universal Credit'
  static readonly JOBSEEKER_ALLOWANCE_INCOME = 'Jobseeker’s Allowance (income based)'
  static readonly JOBSEEKER_ALLOWANCE_CONTRIBUTION = 'Jobseeker’s Allowance (contribution based)'
  static readonly INCOME_SUPPORT = 'Income Support'
  static readonly WORKING_TAX_CREDIT = 'Working Tax Credit'
  static readonly CHILD_TAX_CREDIT = 'Child Tax Credit'
  static readonly CHILD_BENEFIT = 'Child Benefit'
  static readonly COUNCIL_TAX_SUPPORT = 'Council Tax Support'
  static readonly PENSION = 'Pension (paid to you)'
}

export class MonthlyIncome {

  salarySourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.salarySourceDeclared || (o.salarySource && o.salarySource.populated))
  @ValidateNested()
  salarySource?: MonthlyIncomeSource

  universalCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.universalCreditSourceDeclared || (o.universalCreditSource && o.universalCreditSource.populated))
  @ValidateNested()
  universalCreditSource?: MonthlyIncomeSource

  jobseekerAllowanceIncomeSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceIncomeSourceDeclared || (o.jobseekerAllowanceIncomeSource && o.jobseekerAllowanceIncomeSource.populated))
  @ValidateNested()
  jobseekerAllowanceIncomeSource?: MonthlyIncomeSource

  jobseekerAllowanceContributionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceContributionSourceDeclared || (o.jobseekerAllowanceContributionSource && o.jobseekerAllowanceContributionSource.populated))
  @ValidateNested()
  jobseekerAllowanceContributionSource?: MonthlyIncomeSource

  incomeSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.incomeSupportSourceDeclared || (o.incomeSupportSource && o.incomeSupportSource.populated))
  @ValidateNested()
  incomeSupportSource?: MonthlyIncomeSource

  workingTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.workingTaxCreditSourceDeclared || (o.workingTaxCreditSource && o.workingTaxCreditSource.populated))
  @ValidateNested()
  workingTaxCreditSource?: MonthlyIncomeSource

  childTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childTaxCreditSourceDeclared || (o.childTaxCreditSource && o.childTaxCreditSource.populated))
  @ValidateNested()
  childTaxCreditSource?: MonthlyIncomeSource

  childBenefitSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childBenefitSourceDeclared || (o.childBenefitSource && o.childBenefitSource.populated))
  @ValidateNested()
  childBenefitSource?: MonthlyIncomeSource

  councilTaxSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.councilTaxSupportSourceDeclared || (o.councilTaxSupportSource && o.councilTaxSupportSource.populated))
  @ValidateNested()
  councilTaxSupportSource?: MonthlyIncomeSource

  pensionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.pensionSourceDeclared || (o.pensionSource && o.pensionSource.populated))
  @ValidateNested()
  pensionSource?: MonthlyIncomeSource

  otherSourcesDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.otherSourcesDeclared || o.anyOtherIncomePopulated)
  @ValidateNested()
  otherSources?: MonthlyIncomeSource[]

  constructor (
    salarySourceDeclared?: boolean, salarySource?: MonthlyIncomeSource,
    universalCreditSourceDeclared?: boolean, universalCreditSource?: MonthlyIncomeSource,
    jobseekerAllowanceIncomeSourceDeclared?: boolean, jobseekerAllowanceIncomeSource?: MonthlyIncomeSource,
    jobseekerAllowanceContributionSourceDeclared?: boolean, jobseekerAllowanceContributionSource?: MonthlyIncomeSource,
    incomeSupportSourceDeclared?: boolean, incomeSupportSource?: MonthlyIncomeSource,
    workingTaxCreditSourceDeclared?: boolean, workingTaxCreditSource?: MonthlyIncomeSource,
    childTaxCreditSourceDeclared?: boolean, childTaxCreditSource?: MonthlyIncomeSource,
    childBenefitSourceDeclared?: boolean, childBenefitSource?: MonthlyIncomeSource,
    councilTaxSupportSourceDeclared?: boolean, councilTaxSupportSource?: MonthlyIncomeSource,
    pensionSourceDeclared?: boolean, pensionSource?: MonthlyIncomeSource,
    otherSourcesDeclared?: boolean, otherSources: MonthlyIncomeSource[] = [new MonthlyIncomeSource()]
  ) {
    this.salarySourceDeclared = salarySourceDeclared
    this.salarySource = salarySource
    this.universalCreditSourceDeclared = universalCreditSourceDeclared
    this.universalCreditSource = universalCreditSource
    this.jobseekerAllowanceIncomeSourceDeclared = jobseekerAllowanceIncomeSourceDeclared
    this.jobseekerAllowanceIncomeSource = jobseekerAllowanceIncomeSource
    this.jobseekerAllowanceContributionSourceDeclared = jobseekerAllowanceContributionSourceDeclared
    this.jobseekerAllowanceContributionSource = jobseekerAllowanceContributionSource
    this.incomeSupportSourceDeclared = incomeSupportSourceDeclared
    this.incomeSupportSource = incomeSupportSource
    this.workingTaxCreditSourceDeclared = workingTaxCreditSourceDeclared
    this.workingTaxCreditSource = workingTaxCreditSource
    this.childTaxCreditSourceDeclared = childTaxCreditSourceDeclared
    this.childTaxCreditSource = childTaxCreditSource
    this.childBenefitSourceDeclared = childBenefitSourceDeclared
    this.childBenefitSource = childBenefitSource
    this.councilTaxSupportSourceDeclared = councilTaxSupportSourceDeclared
    this.councilTaxSupportSource = councilTaxSupportSource
    this.pensionSourceDeclared = pensionSourceDeclared
    this.pensionSource = pensionSource
    this.otherSourcesDeclared = otherSourcesDeclared
    this.otherSources = otherSources
  }

  static fromObject (value?: any): MonthlyIncome {
    if (!value) {
      return value
    }

    return new MonthlyIncome(
      value.salarySourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.SALARY, value.salarySource),
      value.universalCreditSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.UNIVERSAL_CREDIT, value.universalCreditSource),
      value.jobseekerAllowanceIncomeSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANCE_INCOME, value.jobseekerAllowanceIncomeSource),
      value.jobseekerAllowanceContributionSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, value.jobseekerAllowanceContributionSource),
      value.incomeSupportSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.INCOME_SUPPORT, value.incomeSupportSource),
      value.workingTaxCreditSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.WORKING_TAX_CREDIT, value.workingTaxCreditSource),
      value.childTaxCreditSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.CHILD_TAX_CREDIT, value.childTaxCreditSource),
      value.childBenefitSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.CHILD_BENEFIT, value.childBenefitSource),
      value.councilTaxSupportSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.COUNCIL_TAX_SUPPORT, value.councilTaxSupportSource),
      value.pensionSourceDeclared, MonthlyIncomeSource.fromObject(SourceNames.PENSION, value.pensionSource),
      value.otherSourcesDeclared, value.otherSources && value.otherSources
        .map(source => MonthlyIncomeSource.fromObject(source.name, source))
        .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.salarySourceDeclared = input.salarySourceDeclared
      this.salarySource = new MonthlyIncomeSource().deserialize(input.salarySource)
      this.universalCreditSourceDeclared = input.universalCreditSourceDeclared
      this.universalCreditSource = new MonthlyIncomeSource().deserialize(input.universalCreditSource)
      this.jobseekerAllowanceIncomeSourceDeclared = input.jobseekerAllowanceIncomeSourceDeclared
      this.jobseekerAllowanceIncomeSource = new MonthlyIncomeSource().deserialize(input.jobseekerAllowanceIncomeSource)
      this.jobseekerAllowanceContributionSourceDeclared = input.jobseekerAllowanceContributionSourceDeclared
      this.jobseekerAllowanceContributionSource = new MonthlyIncomeSource().deserialize(input.jobseekerAllowanceContributionSource)
      this.incomeSupportSourceDeclared = input.incomeSupportSourceDeclared
      this.incomeSupportSource = new MonthlyIncomeSource().deserialize(input.incomeSupportSource)
      this.workingTaxCreditSourceDeclared = input.workingTaxCreditSourceDeclared
      this.workingTaxCreditSource = new MonthlyIncomeSource().deserialize(input.workingTaxCreditSource)
      this.childTaxCreditSourceDeclared = input.childTaxCreditSourceDeclared
      this.childTaxCreditSource = new MonthlyIncomeSource().deserialize(input.childTaxCreditSource)
      this.childBenefitSourceDeclared = input.childBenefitSourceDeclared
      this.childBenefitSource = new MonthlyIncomeSource().deserialize(input.childBenefitSource)
      this.councilTaxSupportSourceDeclared = input.councilTaxSupportSourceDeclared
      this.councilTaxSupportSource = new MonthlyIncomeSource().deserialize(input.councilTaxSupportSource)
      this.pensionSourceDeclared = input.pensionSourceDeclared
      this.pensionSource = new MonthlyIncomeSource().deserialize(input.pensionSource)
      this.otherSourcesDeclared = input.otherSourcesDeclared
      this.otherSources = input.otherSources && input.otherSources.map(source => new MonthlyIncomeSource().deserialize(source))
    }

    return this
  }

  get anyOtherIncomePopulated (): boolean {
    return !!this.otherSources && this.otherSources.some(source => source.populated)
  }

  addEmptyOtherIncome (): void {
    this.otherSources.push(new MonthlyIncomeSource())
  }

  removeOtherIncome (source: MonthlyIncomeSource): void {
    this.otherSources.splice(this.otherSources.findIndex(element => element === source), 1)
  }

}
