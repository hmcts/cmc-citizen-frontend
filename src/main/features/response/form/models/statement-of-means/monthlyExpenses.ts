import { IncomeExpenseSource } from 'response/form/models/statement-of-means/incomeExpenseSource'
import { ValidateIf, ValidateNested } from 'class-validator'

export class FieldNames {
  static readonly MORTGAGE = 'mortgage'
  static readonly RENT = 'rent'
  static readonly COUNCIL_TAX = 'Council Tax'
  static readonly GAS = 'gas'
  static readonly ELECTRICITY = 'electricity'
  static readonly WATER = 'water'
  static readonly TRAVEL = 'travel'
  static readonly SCHOOL = 'school costs'
  static readonly FOOD_AND_HOUSEKEEPING = 'food and housekeeping'
  static readonly TV_AND_BROADBAND = 'TV and broadband'
  static readonly HIRE_PURCHASE = 'hire purchases'
  static readonly MOBILE_PHONE = 'mobile phone'
  static readonly MAINTENANCE = 'maintenance'
}

export class MonthlyExpenses {

  mortgageDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated))
  @ValidateNested()
  mortgage?: IncomeExpenseSource

  rentDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.rentDeclared || (o.rent && o.rent.populated))
  @ValidateNested()
  rent?: IncomeExpenseSource

  councilTaxDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated))
  @ValidateNested()
  councilTax?: IncomeExpenseSource

  gasDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.gasDeclared || (o.gas && o.gas.populated))
  @ValidateNested()
  gas?: IncomeExpenseSource

  electricityDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.electricityDeclared || (o.electricity && o.electricity.populated))
  @ValidateNested()
  electricity?: IncomeExpenseSource

  waterDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.waterDeclared || (o.water && o.water.populated))
  @ValidateNested()
  water?: IncomeExpenseSource

  travelDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.travelDeclared || (o.travel && o.travel.populated))
  @ValidateNested()
  travel?: IncomeExpenseSource

  schoolCostsDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.schoolCostsDeclared || (o.schoolCosts && o.schoolCosts.populated))
  @ValidateNested()
  schoolCosts?: IncomeExpenseSource

  foodAndHousekeepingDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.foodAndHousekeepingDeclared ||
    (o.foodAndHousekeeping && o.foodAndHousekeeping.populated))
  @ValidateNested()
  foodAndHousekeeping?: IncomeExpenseSource

  tvAndBroadbandDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.tvAndBroadbandDeclared || (o.tvAndBroadband && o.tvAndBroadband.populated))
  @ValidateNested()
  tvAndBroadband?: IncomeExpenseSource

  hirePurchaseDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.hirePurchaseDeclared || (o.hirePurchase && o.hirePurchase.populated))
  @ValidateNested()
  hirePurchase?: IncomeExpenseSource

  mobilePhoneDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mobilePhoneDeclared || (o.mobilePhone && o.mobilePhone.populated))
  @ValidateNested()
  mobilePhone?: IncomeExpenseSource

  maintenanceDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated))
  @ValidateNested()
  maintenance?: IncomeExpenseSource

  otherDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.otherDeclared || o.anyOtherPopulated)
  @ValidateNested()
  other?: IncomeExpenseSource[]



  constructor (
    mortgageDeclared?: boolean, mortgage?: IncomeExpenseSource,
    rentDeclared?: boolean, rent?: IncomeExpenseSource,
    councilTaxDeclared?: boolean, councilTax?: IncomeExpenseSource,
    gasDeclared?: boolean, gas?: IncomeExpenseSource,
    electricityDeclared?: boolean, electricity?: IncomeExpenseSource,
    waterDeclared?: boolean, water?: IncomeExpenseSource,
    travelDeclared?: boolean, travel?: IncomeExpenseSource,
    schoolCostsDeclared?: boolean, schoolCosts?: IncomeExpenseSource,
    foodAndHousekeepingDeclared?: boolean, foodAndHousekeeping?: IncomeExpenseSource,
    tvAndBroadbandDeclared?: boolean, tvAndBroadband?: IncomeExpenseSource,
    hirePurchaseDeclared?: boolean, hirePurchase?: IncomeExpenseSource,
    mobilePhoneDeclared?: boolean, mobilePhone?: IncomeExpenseSource,
    maintenanceDeclared?: boolean, maintenance?: IncomeExpenseSource,
    otherDeclared?: boolean, other?: IncomeExpenseSource[]
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
      value.mortgageDeclared, IncomeExpenseSource.fromObject(FieldNames.MORTGAGE, value.mortgage),
      value.rentDeclared, IncomeExpenseSource.fromObject(FieldNames.RENT, value.rent),
      value.councilTaxDeclared, IncomeExpenseSource.fromObject(FieldNames.COUNCIL_TAX, value.councilTax),
      value.gasDeclared, IncomeExpenseSource.fromObject(FieldNames.GAS, value.gas),
      value.electricityDeclared, IncomeExpenseSource.fromObject(FieldNames.ELECTRICITY, value.electricity),
      value.waterDeclared, IncomeExpenseSource.fromObject(FieldNames.WATER, value.water),
      value.travelDeclared, IncomeExpenseSource.fromObject(FieldNames.TRAVEL, value.travel),
      value.schoolCostsDeclared, IncomeExpenseSource.fromObject(FieldNames.SCHOOL, value.schoolCosts),
      value.foodAndHousekeepingDeclared, IncomeExpenseSource.fromObject(FieldNames.FOOD_AND_HOUSEKEEPING, value.foodAndHousekeeping),
      value.tvAndBroadbandDeclared, IncomeExpenseSource.fromObject(FieldNames.TV_AND_BROADBAND, value.tvAndBroadband),
      value.hirePurchaseDeclared, IncomeExpenseSource.fromObject(FieldNames.HIRE_PURCHASE, value.hirePurchase),
      value.mobilePhoneDeclared, IncomeExpenseSource.fromObject(FieldNames.MOBILE_PHONE, value.mobilePhone),
      value.maintenanceDeclared, IncomeExpenseSource.fromObject(FieldNames.MAINTENANCE, value.maintenance),
      value.otherDeclared, value.otherSources && value.otherSources
      .map(source => IncomeExpenseSource.fromObject(source.name, source))
      .filter(source => source !== undefined)
    )
  }

  deserialize (input?: any): MonthlyExpenses {
    if (input) {
      this.mortgageDeclared = input.mortgageDeclared
      this.mortgage = new IncomeExpenseSource().deserialize(input.mortgage)
      this.rentDeclared = input.rentDeclared
      this.rent = new IncomeExpenseSource().deserialize(input.rent)
      this.councilTaxDeclared = input.councilTaxDeclared
      this.councilTax = new IncomeExpenseSource().deserialize(input.councilTax)
      this.gasDeclared = input.gasDeclared
      this.gas = new IncomeExpenseSource().deserialize(input.gas)
      this.electricityDeclared = input.electricityDeclared
      this.electricity = new IncomeExpenseSource().deserialize(input.electricity)
      this.waterDeclared = input.waterDeclared
      this.water = new IncomeExpenseSource().deserialize(input.water)
      this.travelDeclared = input.travelDeclared
      this.travel = new IncomeExpenseSource().deserialize(input.travel)
      this.schoolCostsDeclared = input.schoolCostsDeclared
      this.schoolCosts = new IncomeExpenseSource().deserialize(input.schoolCosts)
      this.foodAndHousekeepingDeclared = input.foodAndHousekeepingDeclared
      this.foodAndHousekeeping = new IncomeExpenseSource().deserialize(input.foodAndHousekeeping)
      this.tvAndBroadbandDeclared = input.tvAndBroadbandDeclared
      this.tvAndBroadband = new IncomeExpenseSource().deserialize(input.tvAndBroadband)
      this.hirePurchaseDeclared = input.hirePurchaseDeclared
      this.hirePurchase = new IncomeExpenseSource().deserialize(input.hirePurchase)
      this.mobilePhoneDeclared = input.mobilePhoneDeclared
      this.mobilePhone = new IncomeExpenseSource().deserialize(input.mobilePhone)
      this.maintenanceDeclared = input.maintenanceDeclared
      this.maintenance = new IncomeExpenseSource().deserialize(input.maintenance)

      this.otherDeclared = input.otherDeclared
      this.other = input.other && input.other.map(source => new IncomeExpenseSource().deserialize(source))
    }

    return this
  }

  addEmptyOtherIncome (): void {
    this.other.push(new IncomeExpenseSource())
  }

  removeOtherIncome (source: IncomeExpenseSource): void {
    this.other.splice(this.other.findIndex(element => element === source), 1)
  }

}
