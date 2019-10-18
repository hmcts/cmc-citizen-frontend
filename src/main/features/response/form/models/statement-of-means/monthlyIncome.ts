import { MonthlyIncomeType } from './monthlyIncomeType'
import { IncomeSource } from './incomeSource'
import { ValidateIf, ValidateNested } from '@hmcts/class-validator'

export class MonthlyIncome {

  salarySourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.salarySourceDeclared || (o.salarySource && o.salarySource.populated))
  @ValidateNested()
  salarySource?: IncomeSource

  universalCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.universalCreditSourceDeclared || (o.universalCreditSource && o.universalCreditSource.populated))
  @ValidateNested()
  universalCreditSource?: IncomeSource

  jobseekerAllowanceIncomeSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceIncomeSourceDeclared || (o.jobseekerAllowanceIncomeSource && o.jobseekerAllowanceIncomeSource.populated))
  @ValidateNested()
  jobseekerAllowanceIncomeSource?: IncomeSource

  jobseekerAllowanceContributionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.jobseekerAllowanceContributionSourceDeclared || (o.jobseekerAllowanceContributionSource && o.jobseekerAllowanceContributionSource.populated))
  @ValidateNested()
  jobseekerAllowanceContributionSource?: IncomeSource

  incomeSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.incomeSupportSourceDeclared || (o.incomeSupportSource && o.incomeSupportSource.populated))
  @ValidateNested()
  incomeSupportSource?: IncomeSource

  workingTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.workingTaxCreditSourceDeclared || (o.workingTaxCreditSource && o.workingTaxCreditSource.populated))
  @ValidateNested()
  workingTaxCreditSource?: IncomeSource

  childTaxCreditSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childTaxCreditSourceDeclared || (o.childTaxCreditSource && o.childTaxCreditSource.populated))
  @ValidateNested()
  childTaxCreditSource?: IncomeSource

  childBenefitSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.childBenefitSourceDeclared || (o.childBenefitSource && o.childBenefitSource.populated))
  @ValidateNested()
  childBenefitSource?: IncomeSource

  councilTaxSupportSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.councilTaxSupportSourceDeclared || (o.councilTaxSupportSource && o.councilTaxSupportSource.populated))
  @ValidateNested()
  councilTaxSupportSource?: IncomeSource

  pensionSourceDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.pensionSourceDeclared || (o.pensionSource && o.pensionSource.populated))
  @ValidateNested()
  pensionSource?: IncomeSource

  otherSourcesDeclared?: boolean
  @ValidateIf((o: MonthlyIncome) => o.otherSourcesDeclared || o.anyOtherIncomePopulated)
  @ValidateNested()
  otherSources?: IncomeSource[]

  constructor (
    salarySourceDeclared?: boolean, salarySource?: IncomeSource,
    universalCreditSourceDeclared?: boolean, universalCreditSource?: IncomeSource,
    jobseekerAllowanceIncomeSourceDeclared?: boolean, jobseekerAllowanceIncomeSource?: IncomeSource,
    jobseekerAllowanceContributionSourceDeclared?: boolean, jobseekerAllowanceContributionSource?: IncomeSource,
    incomeSupportSourceDeclared?: boolean, incomeSupportSource?: IncomeSource,
    workingTaxCreditSourceDeclared?: boolean, workingTaxCreditSource?: IncomeSource,
    childTaxCreditSourceDeclared?: boolean, childTaxCreditSource?: IncomeSource,
    childBenefitSourceDeclared?: boolean, childBenefitSource?: IncomeSource,
    councilTaxSupportSourceDeclared?: boolean, councilTaxSupportSource?: IncomeSource,
    pensionSourceDeclared?: boolean, pensionSource?: IncomeSource,
    otherSourcesDeclared?: boolean, otherSources: IncomeSource[] = [new IncomeSource()]
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
      value.salarySourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.JOB.displayValue, value.salarySource),
      value.universalCreditSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, value.universalCreditSource),
      value.jobseekerAllowanceIncomeSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, value.jobseekerAllowanceIncomeSource),
      value.jobseekerAllowanceContributionSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, value.jobseekerAllowanceContributionSource),
      value.incomeSupportSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.INCOME_SUPPORT.displayValue, value.incomeSupportSource),
      value.workingTaxCreditSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, value.workingTaxCreditSource),
      value.childTaxCreditSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, value.childTaxCreditSource),
      value.childBenefitSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.CHILD_BENEFIT.displayValue, value.childBenefitSource),
      value.councilTaxSupportSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, value.councilTaxSupportSource),
      value.pensionSourceDeclared, IncomeSource.fromObject(MonthlyIncomeType.PENSION.displayValue, value.pensionSource),
      value.otherSourcesDeclared, value.otherSources && value.otherSources
        .map(source => IncomeSource.fromObject(source.name, source))
        .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.salarySourceDeclared = input.salarySourceDeclared
      this.salarySource = new IncomeSource().deserialize(input.salarySource)
      this.universalCreditSourceDeclared = input.universalCreditSourceDeclared
      this.universalCreditSource = new IncomeSource().deserialize(input.universalCreditSource)
      this.jobseekerAllowanceIncomeSourceDeclared = input.jobseekerAllowanceIncomeSourceDeclared
      this.jobseekerAllowanceIncomeSource = new IncomeSource().deserialize(input.jobseekerAllowanceIncomeSource)
      this.jobseekerAllowanceContributionSourceDeclared = input.jobseekerAllowanceContributionSourceDeclared
      this.jobseekerAllowanceContributionSource = new IncomeSource().deserialize(input.jobseekerAllowanceContributionSource)
      this.incomeSupportSourceDeclared = input.incomeSupportSourceDeclared
      this.incomeSupportSource = new IncomeSource().deserialize(input.incomeSupportSource)
      this.workingTaxCreditSourceDeclared = input.workingTaxCreditSourceDeclared
      this.workingTaxCreditSource = new IncomeSource().deserialize(input.workingTaxCreditSource)
      this.childTaxCreditSourceDeclared = input.childTaxCreditSourceDeclared
      this.childTaxCreditSource = new IncomeSource().deserialize(input.childTaxCreditSource)
      this.childBenefitSourceDeclared = input.childBenefitSourceDeclared
      this.childBenefitSource = new IncomeSource().deserialize(input.childBenefitSource)
      this.councilTaxSupportSourceDeclared = input.councilTaxSupportSourceDeclared
      this.councilTaxSupportSource = new IncomeSource().deserialize(input.councilTaxSupportSource)
      this.pensionSourceDeclared = input.pensionSourceDeclared
      this.pensionSource = new IncomeSource().deserialize(input.pensionSource)
      this.otherSourcesDeclared = input.otherSourcesDeclared
      this.otherSources = input.otherSources && input.otherSources.map(source => new IncomeSource().deserialize(source))
    }

    return this
  }

  get anyOtherIncomePopulated (): boolean {
    return !!this.otherSources && this.otherSources.some(source => source.populated)
  }

  addEmptyOtherIncome (): void {
    this.otherSources.push(new IncomeSource())
  }

  removeOtherIncome (source: IncomeSource): void {
    this.otherSources.splice(this.otherSources.findIndex(element => element === source), 1)
  }

  resetIncome (propertyName: string, source: IncomeSource): void {
    this[`${propertyName.split('.')[0]}Declared`] = false
    source.reset()
  }

}
