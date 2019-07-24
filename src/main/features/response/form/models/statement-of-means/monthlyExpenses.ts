import { MonthlyExpenseType } from './monthlyExpenseType'
import { ExpenseSource } from 'response/form/models/statement-of-means/expenseSource'
import { ValidateIf, ValidateNested } from '@hmcts/class-validator'

export class MonthlyExpenses {

  mortgageDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated))
  @ValidateNested()
  mortgage?: ExpenseSource

  rentDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.rentDeclared || (o.rent && o.rent.populated))
  @ValidateNested()
  rent?: ExpenseSource

  councilTaxDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated))
  @ValidateNested()
  councilTax?: ExpenseSource

  gasDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.gasDeclared || (o.gas && o.gas.populated))
  @ValidateNested()
  gas?: ExpenseSource

  electricityDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.electricityDeclared || (o.electricity && o.electricity.populated))
  @ValidateNested()
  electricity?: ExpenseSource

  waterDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.waterDeclared || (o.water && o.water.populated))
  @ValidateNested()
  water?: ExpenseSource

  travelDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.travelDeclared || (o.travel && o.travel.populated))
  @ValidateNested()
  travel?: ExpenseSource

  schoolCostsDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.schoolCostsDeclared || (o.schoolCosts && o.schoolCosts.populated))
  @ValidateNested()
  schoolCosts?: ExpenseSource

  foodAndHousekeepingDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.foodAndHousekeepingDeclared ||
    (o.foodAndHousekeeping && o.foodAndHousekeeping.populated))
  @ValidateNested()
  foodAndHousekeeping?: ExpenseSource

  tvAndBroadbandDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.tvAndBroadbandDeclared || (o.tvAndBroadband && o.tvAndBroadband.populated))
  @ValidateNested()
  tvAndBroadband?: ExpenseSource

  hirePurchaseDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.hirePurchaseDeclared || (o.hirePurchase && o.hirePurchase.populated))
  @ValidateNested()
  hirePurchase?: ExpenseSource

  mobilePhoneDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mobilePhoneDeclared || (o.mobilePhone && o.mobilePhone.populated))
  @ValidateNested()
  mobilePhone?: ExpenseSource

  maintenanceDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated))
  @ValidateNested()
  maintenance?: ExpenseSource

  otherDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.otherDeclared || o.anyOtherPopulated)
  @ValidateNested()
  other?: ExpenseSource[]

  constructor (
    mortgageDeclared?: boolean, mortgage?: ExpenseSource,
    rentDeclared?: boolean, rent?: ExpenseSource,
    councilTaxDeclared?: boolean, councilTax?: ExpenseSource,
    gasDeclared?: boolean, gas?: ExpenseSource,
    electricityDeclared?: boolean, electricity?: ExpenseSource,
    waterDeclared?: boolean, water?: ExpenseSource,
    travelDeclared?: boolean, travel?: ExpenseSource,
    schoolCostsDeclared?: boolean, schoolCosts?: ExpenseSource,
    foodAndHousekeepingDeclared?: boolean, foodAndHousekeeping?: ExpenseSource,
    tvAndBroadbandDeclared?: boolean, tvAndBroadband?: ExpenseSource,
    hirePurchaseDeclared?: boolean, hirePurchase?: ExpenseSource,
    mobilePhoneDeclared?: boolean, mobilePhone?: ExpenseSource,
    maintenanceDeclared?: boolean, maintenance?: ExpenseSource,
    otherDeclared?: boolean, other: ExpenseSource[] = [new ExpenseSource()]
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
    this.travelDeclared = travelDeclared
    this.travel = travel
    this.schoolCostsDeclared = schoolCostsDeclared
    this.schoolCosts = schoolCosts
    this.foodAndHousekeepingDeclared = foodAndHousekeepingDeclared
    this.foodAndHousekeeping = foodAndHousekeeping
    this.tvAndBroadbandDeclared = tvAndBroadbandDeclared
    this.tvAndBroadband = tvAndBroadband
    this.hirePurchaseDeclared = hirePurchaseDeclared
    this.hirePurchase = hirePurchase
    this.mobilePhoneDeclared = mobilePhoneDeclared
    this.mobilePhone = mobilePhone
    this.maintenanceDeclared = maintenanceDeclared
    this.maintenance = maintenance
    this.otherDeclared = otherDeclared
    this.other = other
  }

  get anyOtherPopulated (): boolean {
    return !!this.other && this.other.some(source => source.populated)
  }

  static fromObject (value?: any): MonthlyExpenses {
    if (!value) {
      return value
    }
    return new MonthlyExpenses(
      value.mortgageDeclared, ExpenseSource.fromObject(MonthlyExpenseType.MORTGAGE.displayValue, value.mortgage),
      value.rentDeclared, ExpenseSource.fromObject(MonthlyExpenseType.RENT.displayValue, value.rent),
      value.councilTaxDeclared, ExpenseSource.fromObject(MonthlyExpenseType.COUNCIL_TAX.displayValue, value.councilTax),
      value.gasDeclared, ExpenseSource.fromObject(MonthlyExpenseType.GAS.displayValue, value.gas),
      value.electricityDeclared, ExpenseSource.fromObject(MonthlyExpenseType.ELECTRICITY.displayValue, value.electricity),
      value.waterDeclared, ExpenseSource.fromObject(MonthlyExpenseType.WATER.displayValue, value.water),
      value.travelDeclared, ExpenseSource.fromObject(MonthlyExpenseType.TRAVEL.displayValue, value.travel),
      value.schoolCostsDeclared, ExpenseSource.fromObject(MonthlyExpenseType.SCHOOL_COSTS.displayValue, value.schoolCosts),
      value.foodAndHousekeepingDeclared, ExpenseSource.fromObject(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, value.foodAndHousekeeping),
      value.tvAndBroadbandDeclared, ExpenseSource.fromObject(MonthlyExpenseType.TV_AND_BROADBAND.displayValue, value.tvAndBroadband),
      value.hirePurchaseDeclared, ExpenseSource.fromObject(MonthlyExpenseType.HIRE_PURCHASES.displayValue, value.hirePurchase),
      value.mobilePhoneDeclared, ExpenseSource.fromObject(MonthlyExpenseType.MOBILE_PHONE.displayValue, value.mobilePhone),
      value.maintenanceDeclared, ExpenseSource.fromObject(MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, value.maintenance),
      value.otherDeclared, value.other && value.other
      .map(source => ExpenseSource.fromObject(source.name, source))
      .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): MonthlyExpenses {
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
      this.travelDeclared = input.travelDeclared
      this.travel = new ExpenseSource().deserialize(input.travel)
      this.schoolCostsDeclared = input.schoolCostsDeclared
      this.schoolCosts = new ExpenseSource().deserialize(input.schoolCosts)
      this.foodAndHousekeepingDeclared = input.foodAndHousekeepingDeclared
      this.foodAndHousekeeping = new ExpenseSource().deserialize(input.foodAndHousekeeping)
      this.tvAndBroadbandDeclared = input.tvAndBroadbandDeclared
      this.tvAndBroadband = new ExpenseSource().deserialize(input.tvAndBroadband)
      this.hirePurchaseDeclared = input.hirePurchaseDeclared
      this.hirePurchase = new ExpenseSource().deserialize(input.hirePurchase)
      this.mobilePhoneDeclared = input.mobilePhoneDeclared
      this.mobilePhone = new ExpenseSource().deserialize(input.mobilePhone)
      this.maintenanceDeclared = input.maintenanceDeclared
      this.maintenance = new ExpenseSource().deserialize(input.maintenance)
      this.otherDeclared = input.otherDeclared
      this.other = input.other && input.other.map(source => new ExpenseSource().deserialize(source))
    }

    return this
  }

  addEmptyOtherExpense (): void {
    this.other.push(new ExpenseSource())
  }

  removeOtherExpense (source: ExpenseSource): void {
    this.other.splice(this.other.findIndex(element => element === source), 1)
  }

  resetExpense (propertyName: string, source: ExpenseSource): void {
    this[`${propertyName.split('.')[0]}Declared`] = false
    source.reset()
  }

}
