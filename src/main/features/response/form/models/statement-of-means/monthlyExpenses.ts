import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsDefined, Min } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10

export class MonthlyExpenses extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  mortgage?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  rent?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  councilTax?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  gas?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  electricity?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  water?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  travel?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  schoolCosts?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  foodAndHousekeeping?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  tvAndBroadband?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
  mobilePhone?: number

  @IsDefined({ message: GlobalValidationErrors.AMOUNT_REQUIRED })
  @Fractions(0, 2, { message: GlobalValidationErrors.AMOUNT_INVALID_DECIMALS })
  @Min(0, { message: GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED })
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

  getMaxNumberOfRows (): number {
    return MAX_NUMBER_OF_ROWS
  }
}
