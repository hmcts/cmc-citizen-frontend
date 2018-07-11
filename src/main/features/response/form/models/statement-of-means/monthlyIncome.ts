import { ValidateIf, ValidateNested } from 'class-validator'

import { IncomeExpenseSource } from './incomeSource'

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
  salarySource?: IncomeExpenseSource

  universalCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.universalCreditSourceDeclared || (o.universalCreditSource && o.universalCreditSource.populated))
  @ValidateNested()
  universalCreditSource?: IncomeExpenseSource

  jobseekerAllowanceIncomeSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceIncomeSourceDeclared || (o.jobseekerAllowanceIncomeSource && o.jobseekerAllowanceIncomeSource.populated))
  @ValidateNested()
  jobseekerAllowanceIncomeSource?: IncomeExpenseSource

  jobseekerAllowanceContributionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceContributionSourceDeclared || (o.jobseekerAllowanceContributionSource && o.jobseekerAllowanceContributionSource.populated))
  @ValidateNested()
  jobseekerAllowanceContributionSource?: IncomeExpenseSource

  incomeSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.incomeSupportSourceDeclared || (o.incomeSupportSource && o.incomeSupportSource.populated))
  @ValidateNested()
  incomeSupportSource?: IncomeExpenseSource

  workingTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.workingTaxCreditSourceDeclared || (o.workingTaxCreditSource && o.workingTaxCreditSource.populated))
  @ValidateNested()
  workingTaxCreditSource?: IncomeExpenseSource

  childTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childTaxCreditSourceDeclared || (o.childTaxCreditSource && o.childTaxCreditSource.populated))
  @ValidateNested()
  childTaxCreditSource?: IncomeExpenseSource

  childBenefitSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childBenefitSourceDeclared || (o.childBenefitSource && o.childBenefitSource.populated))
  @ValidateNested()
  childBenefitSource?: IncomeExpenseSource

  councilTaxSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.councilTaxSupportSourceDeclared || (o.councilTaxSupportSource && o.councilTaxSupportSource.populated))
  @ValidateNested()
  councilTaxSupportSource?: IncomeExpenseSource

  pensionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.pensionSourceDeclared || (o.pensionSource && o.pensionSource.populated))
  @ValidateNested()
  pensionSource?: IncomeExpenseSource

  otherSourcesDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.otherSourcesDeclared || o.anyOtherIncomePopulated)
  @ValidateNested()
  otherSources?: IncomeExpenseSource[]

  constructor (
    salarySourceDeclared?: boolean, salarySource?: IncomeExpenseSource,
    universalCreditSourceDeclared?: boolean, universalCreditSource?: IncomeExpenseSource,
    jobseekerAllowanceIncomeSourceDeclared?: boolean, jobseekerAllowanceIncomeSource?: IncomeExpenseSource,
    jobseekerAllowanceContributionSourceDeclared?: boolean, jobseekerAllowanceContributionSource?: IncomeExpenseSource,
    incomeSupportSourceDeclared?: boolean, incomeSupportSource?: IncomeExpenseSource,
    workingTaxCreditSourceDeclared?: boolean, workingTaxCreditSource?: IncomeExpenseSource,
    childTaxCreditSourceDeclared?: boolean, childTaxCreditSource?: IncomeExpenseSource,
    childBenefitSourceDeclared?: boolean, childBenefitSource?: IncomeExpenseSource,
    councilTaxSupportSourceDeclared?: boolean, councilTaxSupportSource?: IncomeExpenseSource,
    pensionSourceDeclared?: boolean, pensionSource?: IncomeExpenseSource,
    otherSourcesDeclared?: boolean, otherSources: IncomeExpenseSource[] = [new IncomeExpenseSource()]
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
      value.salarySourceDeclared, IncomeExpenseSource.fromObject(SourceNames.SALARY, value.salarySource),
      value.universalCreditSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.UNIVERSAL_CREDIT, value.universalCreditSource),
      value.jobseekerAllowanceIncomeSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.JOBSEEKER_ALLOWANCE_INCOME, value.jobseekerAllowanceIncomeSource),
      value.jobseekerAllowanceContributionSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, value.jobseekerAllowanceContributionSource),
      value.incomeSupportSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.INCOME_SUPPORT, value.incomeSupportSource),
      value.workingTaxCreditSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.WORKING_TAX_CREDIT, value.workingTaxCreditSource),
      value.childTaxCreditSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.CHILD_TAX_CREDIT, value.childTaxCreditSource),
      value.childBenefitSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.CHILD_BENEFIT, value.childBenefitSource),
      value.councilTaxSupportSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.COUNCIL_TAX_SUPPORT, value.councilTaxSupportSource),
      value.pensionSourceDeclared, IncomeExpenseSource.fromObject(SourceNames.PENSION, value.pensionSource),
      value.otherSourcesDeclared, value.otherSources && value.otherSources
        .map(source => IncomeExpenseSource.fromObject(source.name, source))
        .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.salarySourceDeclared = input.salarySourceDeclared
      this.salarySource = new IncomeExpenseSource().deserialize(input.salarySource)
      this.universalCreditSourceDeclared = input.universalCreditSourceDeclared
      this.universalCreditSource = new IncomeExpenseSource().deserialize(input.universalCreditSource)
      this.jobseekerAllowanceIncomeSourceDeclared = input.jobseekerAllowanceIncomeSourceDeclared
      this.jobseekerAllowanceIncomeSource = new IncomeExpenseSource().deserialize(input.jobseekerAllowanceIncomeSource)
      this.jobseekerAllowanceContributionSourceDeclared = input.jobseekerAllowanceContributionSourceDeclared
      this.jobseekerAllowanceContributionSource = new IncomeExpenseSource().deserialize(input.jobseekerAllowanceContributionSource)
      this.incomeSupportSourceDeclared = input.incomeSupportSourceDeclared
      this.incomeSupportSource = new IncomeExpenseSource().deserialize(input.incomeSupportSource)
      this.workingTaxCreditSourceDeclared = input.workingTaxCreditSourceDeclared
      this.workingTaxCreditSource = new IncomeExpenseSource().deserialize(input.workingTaxCreditSource)
      this.childTaxCreditSourceDeclared = input.childTaxCreditSourceDeclared
      this.childTaxCreditSource = new IncomeExpenseSource().deserialize(input.childTaxCreditSource)
      this.childBenefitSourceDeclared = input.childBenefitSourceDeclared
      this.childBenefitSource = new IncomeExpenseSource().deserialize(input.childBenefitSource)
      this.councilTaxSupportSourceDeclared = input.councilTaxSupportSourceDeclared
      this.councilTaxSupportSource = new IncomeExpenseSource().deserialize(input.councilTaxSupportSource)
      this.pensionSourceDeclared = input.pensionSourceDeclared
      this.pensionSource = new IncomeExpenseSource().deserialize(input.pensionSource)
      this.otherSourcesDeclared = input.otherSourcesDeclared
      this.otherSources = input.otherSources && input.otherSources.map(source => new IncomeExpenseSource().deserialize(source))
    }

    return this
  }

  get anyOtherIncomePopulated (): boolean {
    return !!this.otherSources && this.otherSources.some(source => source.populated)
  }

  addEmptyOtherIncome (): void {
    this.otherSources.push(new IncomeExpenseSource())
  }

  removeOtherIncome (source: IncomeExpenseSource): void {
    this.otherSources.splice(this.otherSources.findIndex(element => element === source), 1)
  }

}
