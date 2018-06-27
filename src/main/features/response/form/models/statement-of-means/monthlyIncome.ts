import { MonthlyIncomeSource } from './monthlyIncomeSource'
import { IsBoolean, ValidateIf, ValidateNested } from 'class-validator'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

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

export class ValidationErrors {
  static readonly BOOLEAN_REQUIRED = (name: string) => `${GlobalValidationErrors.YES_NO_REQUIRED} for ${name}`
}

export class MonthlyIncome {

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.SALARY) })
  hasSalarySource?: boolean

  @ValidateIf(o => o.hasSalarySource)
  @ValidateNested()
  salarySource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.UNIVERSAL_CREDIT) })
  hasUniversalCreditSource?: boolean

  @ValidateIf(o => o.hasUniversalCreditSource)
  @ValidateNested()
  universalCreditSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_INCOME) })
  hasJobseekerAllowanceIncomeSource?: boolean

  @ValidateIf(o => o.hasJobseekerAllowanceIncomeSource)
  @ValidateNested()
  jobseekerAllowanceIncomeSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION) })
  hasJobseekerAllowanceContributionSource?: boolean

  @ValidateIf(o => o.hasJobseekerAllowanceContributionSource)
  @ValidateNested()
  jobseekerAllowanceContributionSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.INCOME_SUPPORT) })
  hasIncomeSupportSource?: boolean

  @ValidateIf(o => o.hasIncomeSupportSource)
  @ValidateNested()
  incomeSupportSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.WORKING_TAX_CREDIT) })
  hasWorkingTaxCreditSource?: boolean

  @ValidateIf(o => o.hasWorkingTaxCreditSource)
  @ValidateNested()
  workingTaxCreditSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_TAX_CREDIT) })
  hasChildTaxCreditSource?: boolean

  @ValidateIf(o => o.hasChildTaxCreditSource)
  @ValidateNested()
  childTaxCreditSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_BENEFIT) })
  hasChildBenefitSource?: boolean

  @ValidateIf(o => o.hasChildBenefitSource)
  @ValidateNested()
  childBenefitSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.COUNCIL_TAX_SUPPORT) })
  hasCouncilTaxSupportSource?: boolean

  @ValidateIf(o => o.hasCouncilTaxSupportSource)
  @ValidateNested()
  councilTaxSupportSource?: MonthlyIncomeSource

  @IsBoolean({ message: ValidationErrors.BOOLEAN_REQUIRED(SourceNames.PENSION) })
  hasPensionSource?: boolean

  @ValidateIf(o => o.hasPensionSource)
  @ValidateNested()
  pensionSource?: MonthlyIncomeSource

  constructor (
    hasSalarySource?: boolean, salarySource?: MonthlyIncomeSource,
    hasUniversalCreditSource?: boolean, universalCreditSource?: MonthlyIncomeSource,
    hasJobseekerAllowanceIncomeSource?: boolean, jobseekerAllowanceIncomeSource?: MonthlyIncomeSource,
    hasJobseekerAllowanceContributionSource?: boolean, jobseekerAllowanceContributionSource?: MonthlyIncomeSource,
    hasIncomeSupportSource?: boolean, incomeSupportSource?: MonthlyIncomeSource,
    hasWorkingTaxCreditSource?: boolean, workingTaxCreditSource?: MonthlyIncomeSource,
    hasChildTaxCreditSource?: boolean, childTaxCreditSource?: MonthlyIncomeSource,
    hasChildBenefitSource?: boolean, childBenefitSource?: MonthlyIncomeSource,
    hasCouncilTaxSupportSource?: boolean, councilTaxSupportSource?: MonthlyIncomeSource,
    hasPensionSource?: boolean, pensionSource?: MonthlyIncomeSource
  ) {
    this.hasSalarySource = hasSalarySource
    this.salarySource = salarySource
    this.hasUniversalCreditSource = hasUniversalCreditSource
    this.universalCreditSource = universalCreditSource
    this.hasJobseekerAllowanceIncomeSource = hasJobseekerAllowanceIncomeSource
    this.jobseekerAllowanceIncomeSource = jobseekerAllowanceIncomeSource
    this.hasJobseekerAllowanceContributionSource = hasJobseekerAllowanceContributionSource
    this.jobseekerAllowanceContributionSource = jobseekerAllowanceContributionSource
    this.hasIncomeSupportSource = hasIncomeSupportSource
    this.incomeSupportSource = incomeSupportSource
    this.hasWorkingTaxCreditSource = hasWorkingTaxCreditSource
    this.workingTaxCreditSource = workingTaxCreditSource
    this.hasChildTaxCreditSource = hasChildTaxCreditSource
    this.childTaxCreditSource = childTaxCreditSource
    this.hasChildBenefitSource = hasChildBenefitSource
    this.childBenefitSource = childBenefitSource
    this.hasCouncilTaxSupportSource = hasCouncilTaxSupportSource
    this.councilTaxSupportSource = councilTaxSupportSource
    this.hasPensionSource = hasPensionSource
    this.pensionSource = pensionSource
  }

  static fromObject (value?: any): MonthlyIncome {
    if (!value) {
      return value
    }

    return new MonthlyIncome(
      Boolean(value.hasSalarySource),
      MonthlyIncomeSource.fromObject(SourceNames.SALARY, value.salarySource),
      Boolean(value.hasUniversalCreditSource),
      MonthlyIncomeSource.fromObject(SourceNames.UNIVERSAL_CREDIT, value.universalCreditSource),
      Boolean(value.hasJobseekerAllowanceIncomeSource),
      MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANE_INCOME, value.jobseekerAllowanceIncomeSource),
      Boolean(value.hasJobseekerAllowanceContributionSource),
      MonthlyIncomeSource.fromObject(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, value.jobseekerAllowanceContributionSource),
      Boolean(value.hasIncomeSupportSource),
      MonthlyIncomeSource.fromObject(SourceNames.INCOME_SUPPORT, value.incomeSupportSource),
      Boolean(value.hasWorkingTaxCreditSource),
      MonthlyIncomeSource.fromObject(SourceNames.WORKING_TAX_CREDIT, value.workingTaxCreditSource),
      Boolean(value.hasChildTaxCreditSource),
      MonthlyIncomeSource.fromObject(SourceNames.CHILD_TAX_CREDIT, value.childTaxCreditSource),
      Boolean(value.hasChildBenefitSource),
      MonthlyIncomeSource.fromObject(SourceNames.CHILD_BENEFIT, value.childBenefitSource),
      Boolean(value.hasCouncilTaxSupportSource),
      MonthlyIncomeSource.fromObject(SourceNames.COUNCIL_TAX_SUPPORT, value.councilTaxSupportSource),
      Boolean(value.hasPensionSource),
      MonthlyIncomeSource.fromObject(SourceNames.PENSION, value.pensionSource)
    )
  }

  normalize (): MonthlyIncome {
    const clone = Object.assign({}, this)
    clone.hasSalarySource = hasSource(this.salarySource)
    clone.hasUniversalCreditSource = hasSource(this.universalCreditSource)
    clone.hasJobseekerAllowanceIncomeSource = hasSource(this.jobseekerAllowanceIncomeSource)
    clone.hasJobseekerAllowanceContributionSource = hasSource(this.jobseekerAllowanceContributionSource)
    clone.hasIncomeSupportSource = hasSource(this.incomeSupportSource)
    clone.hasWorkingTaxCreditSource = hasSource(this.workingTaxCreditSource)
    clone.hasChildTaxCreditSource = hasSource(this.childTaxCreditSource)
    clone.hasChildBenefitSource = hasSource(this.childBenefitSource)
    clone.hasCouncilTaxSupportSource = hasSource(this.councilTaxSupportSource)
    clone.hasPensionSource = hasSource(this.pensionSource)
    return clone
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.hasSalarySource = input.hasSalarySource
      this.salarySource = input.salarySource
      this.hasUniversalCreditSource = input.hasUniversalCreditSource
      this.universalCreditSource = input.universalCreditSource
      this.hasJobseekerAllowanceIncomeSource = input.hasJobseekerAllowanceIncomeSource
      this.jobseekerAllowanceIncomeSource = input.jobseekerAllowanceIncomeSource
      this.hasJobseekerAllowanceContributionSource = input.hasJobseekerAllowanceContributionSource
      this.jobseekerAllowanceContributionSource = input.jobseekerAllowanceContributionSource
      this.hasIncomeSupportSource = input.hasIncomeSupportSource
      this.incomeSupportSource = input.incomeSupportSource
      this.hasWorkingTaxCreditSource = input.hasWorkingTaxCreditSource
      this.workingTaxCreditSource = input.workingTaxCreditSource
      this.hasChildTaxCreditSource = input.hasChildTaxCreditSource
      this.childTaxCreditSource = input.childTaxCreditSource
      this.hasChildBenefitSource = input.hasChildBenefitSource
      this.childBenefitSource = input.childBenefitSource
      this.hasCouncilTaxSupportSource = input.hasCouncilTaxSupportSource
      this.councilTaxSupportSource = input.councilTaxSupportSource
      this.hasPensionSource = input.hasPensionSource
      this.pensionSource = input.pensionSource
    }

    return this
  }
}

function hasSource (source: MonthlyIncomeSource): boolean {
  return source ? Boolean(source.amount || source.schedule) : undefined
}
