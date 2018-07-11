import { IncomeExpenseSource } from 'response/form/models/statement-of-means/incomeExpenseSource'
import { ValidateIf, ValidateNested } from 'class-validator'

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
      value.mortgageDeclared, value.mortgage,
      value.rentDeclared, value.rent,
      value.councilTaxDeclared, value.councilTax,
      value.gasDeclared, value.gas,
      value.electricityDeclared, value.electricity,
      value.waterDeclared, value.water,
      value.travelDeclared, value.travel,
      value.schoolCostsDeclared, value.schoolCosts,
      value.foodAndHousekeepingDeclared, value.foodAndHousekeeping,
      value.tvAndBroadbandDeclared, value.tvAndBroadband,
      value.hirePurchaseDeclared, value.hirePurchase,
      value.mobilePhoneDeclared, value.mobilePhone,
      value.maintenanceDeclared, value.maintenance,
      value.otherDeclared, value.otherSources && value.otherSources
      .map(source => IncomeExpenseSource.fromObject(source.name, source))
      .filter(source => source !== undefined)
    )
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
