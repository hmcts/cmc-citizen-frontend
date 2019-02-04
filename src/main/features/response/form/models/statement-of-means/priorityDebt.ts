import { ExpenseSource } from './expenseSource'
import { ValidateIf, ValidateNested } from '@hmcts/class-validator'
import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'

export class PriorityDebt {

  mortgageDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated))
  @ValidateNested()
  mortgage?: ExpenseSource

  rentDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.rentDeclared || (o.rent && o.rent.populated))
  @ValidateNested()
  rent?: ExpenseSource

  councilTaxDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated))
  @ValidateNested()
  councilTax?: ExpenseSource

  gasDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.gasDeclared || (o.gas && o.gas.populated))
  @ValidateNested()
  gas?: ExpenseSource

  electricityDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.electricityDeclared || (o.electricity && o.electricity.populated))
  @ValidateNested()
  electricity?: ExpenseSource

  waterDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.waterDeclared || (o.water && o.water.populated))
  @ValidateNested()
  water?: ExpenseSource

  maintenanceDeclared?: boolean
  @ValidateIf((o: PriorityDebt) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated))
  @ValidateNested()
  maintenance?: ExpenseSource

  constructor (
    mortgageDeclared?: boolean, mortgage?: ExpenseSource,
    rentDeclared?: boolean, rent?: ExpenseSource,
    councilTaxDeclared?: boolean, councilTax?: ExpenseSource,
    gasDeclared?: boolean, gas?: ExpenseSource,
    electricityDeclared?: boolean, electricity?: ExpenseSource,
    waterDeclared?: boolean, water?: ExpenseSource,
    maintenanceDeclared?: boolean, maintenance?: ExpenseSource
  ) {
    this.mortgageDeclared = mortgageDeclared
    this.mortgage = mortgage
    this.rentDeclared = rentDeclared
    this.rent = rent
    this.councilTaxDeclared = councilTaxDeclared
    this.councilTax = councilTax
    this.gasDeclared = gasDeclared
    this.gas = gas
    this.electricityDeclared = electricityDeclared
    this.electricity = electricity
    this.waterDeclared = waterDeclared
    this.water = water
    this.maintenanceDeclared = maintenanceDeclared
    this.maintenance = maintenance
  }

  static fromObject (value?: any): PriorityDebt {
    if (!value) {
      return value
    }

    return new PriorityDebt(
      value.mortgageDeclared, ExpenseSource.fromObject(
        PriorityDebtType.MORTGAGE.displayValue, value.mortgage),
      value.rentDeclared, ExpenseSource.fromObject(
        PriorityDebtType.RENT.displayValue, value.rent),
      value.councilTaxDeclared, ExpenseSource.fromObject(
        PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, value.councilTax),
      value.gasDeclared, ExpenseSource.fromObject(
        PriorityDebtType.GAS.displayValue, value.gas),
      value.electricityDeclared, ExpenseSource.fromObject(
        PriorityDebtType.ELECTRICITY.displayValue, value.electricity),
      value.waterDeclared, ExpenseSource.fromObject(
        PriorityDebtType.WATER.displayValue, value.water),
      value.maintenanceDeclared, ExpenseSource.fromObject(
        PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, value.maintenance)
    )
  }

  deserialize (input?: any): PriorityDebt {
    if (input) {
      this.mortgageDeclared = input.mortgageDeclared
      this.mortgage = new ExpenseSource().deserialize(input.mortgage)
      this.rentDeclared = input.rentDeclared
      this.rent = new ExpenseSource().deserialize(input.rent)
      this.councilTaxDeclared = input.councilTaxDeclared
      this.councilTax = new ExpenseSource().deserialize(input.councilTax)
      this.gasDeclared = input.gasDeclared
      this.gas = new ExpenseSource().deserialize(input.gas)
      this.electricityDeclared = input.electricityDeclared
      this.electricity = new ExpenseSource().deserialize(input.electricity)
      this.waterDeclared = input.waterDeclared
      this.water = new ExpenseSource().deserialize(input.water)
      this.maintenanceDeclared = input.maintenanceDeclared
      this.maintenance = new ExpenseSource().deserialize(input.maintenance)
    }

    return this
  }

  resetIncome (propertyName: string, source: ExpenseSource): void {
    this[`${propertyName.split('.')[0]}Declared`] = false
    source.reset()
  }

}
