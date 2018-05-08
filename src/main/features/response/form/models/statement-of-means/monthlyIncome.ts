import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'shared/utils/numericUtils'
import { IsDefined } from 'class-validator'
import { Fractions } from '@hmcts/cmc-validators'
import { Min } from 'forms/validation/validators/min'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class ValidationErrors {
  static readonly AMOUNT_REQUIRED_SALARY: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Salary`
  static readonly AMOUNT_INVALID_DECIMALS_SALARY: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Salary`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_SALARY: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Salary`

  static readonly AMOUNT_REQUIRED_CREDIT: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Universal Credit`
  static readonly AMOUNT_INVALID_DECIMALS_CREDIT: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Rent`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_CREDIT: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Rent`

  static readonly AMOUNT_REQUIRED_JOB_SEEK_INCOME: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Jobseeker’s Allowance (income based)`
  static readonly AMOUNT_INVALID_DECIMALS_JOB_SEEK_INCOME: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Jobseeker’s Allowance (income based)`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_JOB_SEEK_INCOME: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Jobseeker’s Allowance (income based)`

  static readonly AMOUNT_REQUIRED_JOB_SEEK_CONTRIBUTION: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Jobseeker’s Allowance (contribution based)`
  static readonly AMOUNT_INVALID_DECIMALS_JOB_SEEK_CONTRIBUTION: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Jobseeker’s Allowance (contribution based)`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_JOB_SEEK_CONTRIBUTION: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Jobseeker’s Allowance (contribution based)`

  static readonly AMOUNT_REQUIRED_INCOME: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Income Support`
  static readonly AMOUNT_INVALID_DECIMALS_INCOME: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Income Support`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_INCOME: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Income Support`

  static readonly AMOUNT_REQUIRED_WORKING_TAX_CREDIT: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Working Tax Credit`
  static readonly AMOUNT_INVALID_DECIMALS_WORKING_TAX_CREDIT: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Working Tax Credit`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_WORKING_TAX_CREDIT: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Working Tax Credit`

  static readonly AMOUNT_REQUIRED_CHILD_TAX_CREDIT: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Child Tax Credit`
  static readonly AMOUNT_INVALID_DECIMALS_CHILD_TAX_CREDIT: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Child Tax Credit`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_CHILD_TAX_CREDIT: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Child Tax Credit`

  static readonly AMOUNT_REQUIRED_CHILD_BENEFIT: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Child Benefit`
  static readonly AMOUNT_INVALID_DECIMALS_CHILD_BENEFIT: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Child Benefit`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_CHILD_BENEFIT: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Child Benefit`

  static readonly AMOUNT_REQUIRED_COUNCIL_TAX_SUPPORT: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Council Tax Support`
  static readonly AMOUNT_INVALID_DECIMALS_COUNCIL_TAX_SUPPORT: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Council Tax Support`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_COUNCIL_TAX_SUPPORT: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Council Tax Support`

  static readonly AMOUNT_REQUIRED_PENSION: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Pension (paid to you)`
  static readonly AMOUNT_INVALID_DECIMALS_PENSION: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Pension (paid to you)`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_PENSION: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Pension (paid to you)`

  static readonly AMOUNT_REQUIRED_MAINTENANCE: string = `${GlobalValidationErrors.AMOUNT_REQUIRED} for Maintenance payments (paid to you)`
  static readonly AMOUNT_INVALID_DECIMALS_MAINTENANCE: string = `${GlobalValidationErrors.AMOUNT_INVALID_DECIMALS} for Maintenance payments (paid to you)`
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_MAINTENANCE: string = `${GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED} for Maintenance payments (paid to you)`
}

export class MonthlyIncome extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_SALARY })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_SALARY })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_SALARY })
  salary?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_CREDIT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_CREDIT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_CREDIT })
  universalCredit?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_JOB_SEEK_INCOME })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_JOB_SEEK_INCOME })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_JOB_SEEK_INCOME })
  jobSeekerAllowanceIncome?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_JOB_SEEK_CONTRIBUTION })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_JOB_SEEK_CONTRIBUTION })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_JOB_SEEK_CONTRIBUTION })
  jobSeekerAllowanceContribution?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_INCOME })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_INCOME })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_INCOME })
  incomeSupport?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_WORKING_TAX_CREDIT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_WORKING_TAX_CREDIT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_WORKING_TAX_CREDIT })
  workingTaxCredit?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_CHILD_TAX_CREDIT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_CHILD_TAX_CREDIT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_CHILD_TAX_CREDIT })
  childTaxCredit?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_CHILD_BENEFIT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_CHILD_BENEFIT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_CHILD_BENEFIT })
  childBenefit?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_COUNCIL_TAX_SUPPORT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_COUNCIL_TAX_SUPPORT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_COUNCIL_TAX_SUPPORT })
  councilTaxSupport?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_PENSION })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_PENSION })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_PENSION })
  pension?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_MAINTENANCE })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_MAINTENANCE })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_MAINTENANCE })
  maintenance?: number

  constructor (salary?: number,
               universalCredit?: number,
               jobSeekerAllowanceIncome?: number,
               jobSeekerAllowanceContribution?: number,
               incomeSupport?: number,
               workingTaxCredit?: number,
               childTaxCredit?: number,
               childBenefit?: number,
               councilTaxSupport?: number,
               pension?: number,
               maintenance?: number,
               rows?: AmountDescriptionRow[]) {
    super(rows)
    this.salary = salary
    this.universalCredit = universalCredit
    this.jobSeekerAllowanceIncome = jobSeekerAllowanceIncome
    this.jobSeekerAllowanceContribution = jobSeekerAllowanceContribution
    this.incomeSupport = incomeSupport
    this.workingTaxCredit = workingTaxCredit
    this.childTaxCredit = childTaxCredit
    this.childBenefit = childBenefit
    this.councilTaxSupport = councilTaxSupport
    this.pension = pension
    this.maintenance = maintenance
  }

  static fromObject (value?: any): MonthlyIncome {
    if (!value) {
      return value
    }

    return new MonthlyIncome(
      toNumberOrUndefined(value.salary),
      toNumberOrUndefined(value.universalCredit),
      toNumberOrUndefined(value.jobSeekerAllowanceIncome),
      toNumberOrUndefined(value.jobSeekerAllowanceContribution),
      toNumberOrUndefined(value.incomeSupport),
      toNumberOrUndefined(value.workingTaxCredit),
      toNumberOrUndefined(value.childTaxCredit),
      toNumberOrUndefined(value.childBenefit),
      toNumberOrUndefined(value.councilTaxSupport),
      toNumberOrUndefined(value.pension),
      toNumberOrUndefined(value.maintenance),
      value.rows ? value.rows.map(AmountDescriptionRow.fromObject) : []
    )
  }

  createEmptyRow (): AmountDescriptionRow {
    return new AmountDescriptionRow(undefined)
  }

  deserialize (input?: any): MonthlyIncome {
    if (input) {
      this.salary = input.salary
      this.universalCredit = input.universalCredit
      this.jobSeekerAllowanceIncome = input.jobSeekerAllowanceIncome
      this.jobSeekerAllowanceContribution = input.jobSeekerAllowanceContribution
      this.incomeSupport = input.incomeSupport
      this.workingTaxCredit = input.workingTaxCredit
      this.childTaxCredit = input.childTaxCredit
      this.childBenefit = input.childBenefit
      this.councilTaxSupport = input.councilTaxSupport
      this.pension = input.pension
      this.maintenance = input.maintenance

      this.rows = this.deserializeRows(input.rows)
    }

    return this
  }

  getInitialNumberOfRows (): number {
    return INIT_ROW_COUNT
  }

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }
}
