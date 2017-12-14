import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsDefined, Min } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10

export class MonthlyIncome extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  salary?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  universalCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  jobSeekerAllowanceIncome?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  jobSeekerAllowanceContribution?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  incomeSupport?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  workingTaxCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  childTaxCredit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  childBenefit?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  councilTaxSupport?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  pension?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
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

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }
}
