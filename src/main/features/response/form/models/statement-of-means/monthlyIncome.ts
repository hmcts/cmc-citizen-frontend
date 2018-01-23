import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsDefined } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Min } from 'forms/validation/validators/min'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class MonthlyIncome extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Salary' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Salary' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Salary' })
  salary?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Universal Credit' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Universal Credit' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Universal Credit' })
  universalCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Jobseeker’s Allowance (income based)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Jobseeker’s Allowance (income based)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Jobseeker’s Allowance (income based)' })
  jobSeekerAllowanceIncome?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Jobseeker’s Allowance (contribution based)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Jobseeker’s Allowance (contribution based)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Jobseeker’s Allowance (contribution based)' })
  jobSeekerAllowanceContribution?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Income Support' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Income Support' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Income Support' })
  incomeSupport?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Working Tax Credit' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Working Tax Credit' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Working Tax Credit' })
  workingTaxCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Child Tax Credit' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Child Tax Credit' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Child Tax Credit' })
  childTaxCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Child Benefit' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Child Benefit' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Child Benefit' })
  childBenefit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Council Tax Support' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Council Tax Support' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Council Tax Support' })
  councilTaxSupport?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Pension (paid to you)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Pension (paid to you)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Pension (paid to you)' })
  pension?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Maintenance payments (paid to you)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Maintenance payments (paid to you)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Maintenance payments (paid to you)' })
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
