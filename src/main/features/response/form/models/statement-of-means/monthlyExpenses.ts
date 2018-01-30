import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsDefined } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Min } from 'forms/validation/validators/min'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class MonthlyExpenses extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Mortgage (Include all mortgages)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Mortgage (Include all mortgages)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Mortgage (Include all mortgages)' })
  mortgage?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Rent' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Rent' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Rent' })
  rent?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Council Tax' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Council Tax' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Council Tax' })
  councilTax?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Gas' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Gas' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Gas' })
  gas?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Electricity' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Electricity' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Electricity' })
  electricity?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Water' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Water' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Water' })
  water?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Travel (school or work)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Travel (school or work)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Travel (school or work)' })
  travel?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for School Costs (include clothing)' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for School Costs (include clothing)' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for School Costs (include clothing)' })
  schoolCosts?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Food and Housekeeping' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Food and Housekeeping' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Food and Housekeeping' })
  foodAndHousekeeping?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for TV and Broadband' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for TV and Broadband' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for TV and Broadband' })
  tvAndBroadband?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Mobile Phone' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Mobile Phone' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Mobile Phone' })
  mobilePhone?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED + ' for Maintenance payments' })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Maintenance payments' })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Maintenance payments' })
  maintenance?: number

  constructor (mortgage?: number,
               rent?: number,
               councilTax?: number,
               gas?: number,
               electricity?: number,
               water?: number,
               travel?: number,
               schoolCosts?: number,
               foodAndHousekeeping?: number,
               tvAndBroadband?: number,
               mobilePhone?: number,
               maintenance?: number,
               rows?: AmountDescriptionRow[]) {
    super(rows)
    this.mortgage = mortgage
    this.rent = rent
    this.councilTax = councilTax
    this.gas = gas
    this.electricity = electricity
    this.water = water
    this.travel = travel
    this.schoolCosts = schoolCosts
    this.foodAndHousekeeping = foodAndHousekeeping
    this.tvAndBroadband = tvAndBroadband
    this.mobilePhone = mobilePhone
    this.maintenance = maintenance
  }

  static fromObject (value?: any): MonthlyExpenses {
    if (!value) {
      return value
    }

    return new MonthlyExpenses(
      toNumberOrUndefined(value.mortgage),
      toNumberOrUndefined(value.rent),
      toNumberOrUndefined(value.councilTax),
      toNumberOrUndefined(value.gas),
      toNumberOrUndefined(value.electricity),
      toNumberOrUndefined(value.water),
      toNumberOrUndefined(value.travel),
      toNumberOrUndefined(value.schoolCosts),
      toNumberOrUndefined(value.foodAndHousekeeping),
      toNumberOrUndefined(value.tvAndBroadband),
      toNumberOrUndefined(value.mobilePhone),
      toNumberOrUndefined(value.maintenance),
      value.rows ? value.rows.map(AmountDescriptionRow.fromObject) : []
    )
  }

  createEmptyRow (): AmountDescriptionRow {
    return new AmountDescriptionRow(undefined)
  }

  deserialize (input?: any): MonthlyExpenses {
    if (input) {
      this.mortgage = input.mortgage
      this.rent = input.rent
      this.councilTax = input.councilTax
      this.gas = input.gas
      this.electricity = input.electricity
      this.water = input.water
      this.travel = input.travel
      this.schoolCosts = input.schoolCosts
      this.foodAndHousekeeping = input.foodAndHousekeeping
      this.tvAndBroadband = input.tvAndBroadband
      this.mobilePhone = input.mobilePhone
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
