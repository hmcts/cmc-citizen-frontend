import { IncomeSource } from 'response/form/models/statement-of-means/incomeSource'
import { ValidateIf, ValidateNested } from 'class-validator'

export class MonthlyExpenses {

  mortgageDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mortgageDeclared || (o.mortgage && o.mortgage.populated))
  @ValidateNested()
  mortgage?: IncomeSource

  rentDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.rentDeclared || (o.rent && o.rent.populated))
  @ValidateNested()
  rent?: IncomeSource

  councilTaxDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.councilTaxDeclared || (o.councilTax && o.councilTax.populated))
  @ValidateNested()
  councilTax?: IncomeSource

  gasDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.gasDeclared || (o.gas && o.gas.populated))
  @ValidateNested()
  gas?: IncomeSource

  electricityDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.electricityDeclared || (o.electricity && o.electricity.populated))
  @ValidateNested()
  electricity?: IncomeSource

  waterDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.waterDeclared || (o.water && o.water.populated))
  @ValidateNested()
  water?: IncomeSource

  travelDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.travelDeclared || (o.travel && o.travel.populated))
  @ValidateNested()
  travel?: IncomeSource

  schoolCostsDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.schoolCostsDeclared || (o.schoolCosts && o.schoolCosts.populated))
  @ValidateNested()
  schoolCosts?: IncomeSource

  foodAndHousekeepingDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.foodAndHousekeepingDeclared ||
    (o.foodAndHousekeeping && o.foodAndHousekeeping.populated))
  @ValidateNested()
  foodAndHousekeeping?: IncomeSource

  tvAndBroadbandDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.tvAndBroadbandDeclared || (o.tvAndBroadband && o.tvAndBroadband.populated))
  @ValidateNested()
  tvAndBroadband?: IncomeSource

  hirePurchaseDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.hirePurchaseDeclared || (o.hirePurchase && o.hirePurchase.populated))
  @ValidateNested()
  hirePurchase?: IncomeSource

  mobilePhoneDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.mobilePhoneDeclared || (o.mobilePhone && o.mobilePhone.populated))
  @ValidateNested()
  mobilePhone?: IncomeSource

  maintenanceDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.maintenanceDeclared || (o.maintenance && o.maintenance.populated))
  @ValidateNested()
  maintenance?: IncomeSource

  otherDeclared?: boolean
  @ValidateIf((o: MonthlyExpenses) => o.otherDeclared || o.anyOtherPopulated)
  @ValidateNested()
  other?: IncomeSource[]



  constructor (
    mortgageDeclared?: boolean, mortgage?: IncomeSource,
    rentDeclared?: boolean, rent?: IncomeSource,
    councilTaxDeclared?: boolean, councilTax?: IncomeSource,
    gasDeclared?: boolean, gas?: IncomeSource,
    electricityDeclared?: boolean, electricity?: IncomeSource,
    waterDeclared?: boolean, water?: IncomeSource,
    travelDeclared?: boolean, travel?: IncomeSource,
    schoolCostsDeclared?: boolean, schoolCosts?: IncomeSource,
    foodAndHousekeepingDeclared?: boolean, foodAndHousekeeping?: IncomeSource,
    tvAndBroadbandDeclared?: boolean, tvAndBroadband?: IncomeSource,
    hirePurchaseDeclared?: boolean, hirePurchase?: IncomeSource,
    mobilePhoneDeclared?: boolean, mobilePhone?: IncomeSource,
    maintenanceDeclared?: boolean, maintenance?: IncomeSource,
    otherDeclared?: boolean, other?: IncomeSource[]
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
      .map(source => IncomeSource.fromObject(source.name, source))
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
    this.other.push(new IncomeSource())
  }

  removeOtherIncome (source: IncomeSource): void {
    this.other.splice(this.other.findIndex(element => element === source), 1)
  }

}
