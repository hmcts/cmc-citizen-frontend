import { AmountDescriptionRow } from 'features/response/form/models/statement-of-means/amountDescriptionRow'
import { MultiRowForm } from 'forms/models/multiRowForm'
import { toNumberOrUndefined } from 'common/utils/numericUtils'
import { IsDefined } from 'class-validator'
import { Fractions } from 'forms/validation/validators/fractions'
import { Min } from 'forms/validation/validators/min'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'

export const MAX_NUMBER_OF_ROWS: number = 10
export const INIT_ROW_COUNT: number = 0

export class ValidationErrors {
  static readonly AMOUNT_REQUIRED_MORTGAGE: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Mortgage (Include all mortgages)'
  static readonly AMOUNT_INVALID_DECIMALS_MORTGAGE: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Mortgage (Include all mortgages)'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_MORTGAGE: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Mortgage (Include all mortgages)'

  static readonly AMOUNT_REQUIRED_RENT: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Rent'
  static readonly AMOUNT_INVALID_DECIMALS_RENT: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Rent'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_RENT: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Rent'

  static readonly AMOUNT_REQUIRED_COUNCIL: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Council Tax'
  static readonly AMOUNT_INVALID_DECIMALS_COUNCIL: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Council Tax'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_COUNCIL: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Council Tax'

  static readonly AMOUNT_REQUIRED_GAS: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Gas'
  static readonly AMOUNT_INVALID_DECIMALS_GAS: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Gas'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_GAS: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Gas'

  static readonly AMOUNT_REQUIRED_ELECTRICITY: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Electricity'
  static readonly AMOUNT_INVALID_DECIMALS_ELECTRICITY: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Electricity'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_ELECTRICITY: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Electricity'

  static readonly AMOUNT_REQUIRED_WATER: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Water'
  static readonly AMOUNT_INVALID_DECIMALS_WATER: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Water'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_WATER: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Water'

  static readonly AMOUNT_REQUIRED_TRAVEL: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Travel (school or work)'
  static readonly AMOUNT_INVALID_DECIMALS_TRAVEL: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Water (school or work)'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_TRAVEL: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Water (school or work)'

  static readonly AMOUNT_REQUIRED_SCHOOL: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for School Costs (include clothing)'
  static readonly AMOUNT_INVALID_DECIMALS_SCHOOL: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for School Costs (include clothing)'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_SCHOOL: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for School Costs (include clothing)'

  static readonly AMOUNT_REQUIRED_FOOD: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Food and Housekeeping'
  static readonly AMOUNT_INVALID_DECIMALS_FOOD: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Food and Housekeeping'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_FOOD: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Food and Housekeeping'

  static readonly AMOUNT_REQUIRED_TV: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for TV and Broadband'
  static readonly AMOUNT_INVALID_DECIMALS_TV: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for TV and Broadband'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_TV: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for TV and Broadband'

  static readonly AMOUNT_REQUIRED_MOBILE: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Mobile Phone'
  static readonly AMOUNT_INVALID_DECIMALS_MOBILE: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Mobile Phone'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_MOBILE: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Mobile Phone'

  static readonly AMOUNT_REQUIRED_MAINTENANCE: string = GlobalValidationErrors.AMOUNT_REQUIRED + ' for Maintenance payments'
  static readonly AMOUNT_INVALID_DECIMALS_MAINTENANCE: string = GlobalValidationErrors.AMOUNT_INVALID_DECIMALS + ' for Maintenance payments'
  static readonly NON_NEGATIVE_NUMBER_REQUIRED_MAINTENANCE: string = GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Maintenance payments'
}

export class MonthlyExpenses extends MultiRowForm<AmountDescriptionRow> {

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_MORTGAGE })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_MORTGAGE })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_MORTGAGE })
  mortgage?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_RENT })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_RENT })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_RENT })
  rent?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_COUNCIL })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_COUNCIL })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_COUNCIL })
  councilTax?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_GAS })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_GAS })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_GAS })
  gas?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_ELECTRICITY })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_ELECTRICITY })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_ELECTRICITY })
  electricity?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_WATER })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_WATER })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_WATER })
  water?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_TRAVEL })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_TRAVEL })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_TRAVEL })
  travel?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_SCHOOL })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_SCHOOL })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_SCHOOL })
  schoolCosts?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_FOOD })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_FOOD })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_FOOD })
  foodAndHousekeeping?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_TV })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_TV })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_TV })
  tvAndBroadband?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_MOBILE })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_MOBILE })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_MOBILE })
  mobilePhone?: number

  @IsDefined({ message: ValidationErrors.AMOUNT_REQUIRED_MAINTENANCE })
  @Min(0, { message: ValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED_MAINTENANCE })
  @Fractions(0, 2, { message: ValidationErrors.AMOUNT_INVALID_DECIMALS_MAINTENANCE })
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
