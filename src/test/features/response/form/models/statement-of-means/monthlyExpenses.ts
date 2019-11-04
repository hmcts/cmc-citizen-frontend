import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { ExpenseSource, ValidationErrors as MonthlyExpensesSourceValidationErrors } from 'response/form/models/statement-of-means/expenseSource'
import { MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'
import { MonthlyExpenseType } from 'response/form/models/statement-of-means/monthlyExpenseType'

function getSampleMonthlyExpensesObject (options?: object) {
  const DEFAULT_SAMPLE_VALID_MONTHLY_EXPENSES = {
    mortgage: {
      amount: 100,
      schedule: IncomeExpenseSchedule.MONTH
    },
    rent: {
      amount: 200,
      schedule: IncomeExpenseSchedule.MONTH
    },
    councilTax: {
      amount: 300,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    gas: {
      amount: 400,
      schedule: IncomeExpenseSchedule.MONTH
    },
    electricity: {
      amount: 500,
      schedule: IncomeExpenseSchedule.MONTH
    },
    water: {
      amount: 600,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    travel: {
      amount: 700,
      schedule: IncomeExpenseSchedule.MONTH
    },
    schoolCosts: {
      amount: 800,
      schedule: IncomeExpenseSchedule.MONTH
    },
    foodAndHousekeeping: {
      amount: 900,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    tvAndBroadband: {
      amount: 100,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    hirePurchase: {
      amount: 100,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    mobilePhone: {
      amount: 100,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    maintenance: {
      amount: 100,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    }
  }

  const sampleData = Object.assign({}, DEFAULT_SAMPLE_VALID_MONTHLY_EXPENSES, options || {})

  return {
    sampleData,
    forConstructor: forConstructor,
    forFromObjectMethod: forFromObjectMethod,
    forDeserialize: forDeserialize
  }
}

function forConstructor () {
  return new MonthlyExpenses(
    undefined, new ExpenseSource(MonthlyExpenseType.MORTGAGE.displayValue, this.sampleData.mortgage.amount, this.sampleData.mortgage.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.RENT.displayValue, this.sampleData.rent.amount, this.sampleData.rent.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.COUNCIL_TAX.displayValue, this.sampleData.councilTax.amount, this.sampleData.councilTax.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.GAS.displayValue, this.sampleData.gas.amount, this.sampleData.gas.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.ELECTRICITY.displayValue, this.sampleData.electricity.amount, this.sampleData.electricity.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.WATER.displayValue, this.sampleData.water.amount, this.sampleData.water.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.TRAVEL.displayValue, this.sampleData.travel.amount, this.sampleData.travel.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.SCHOOL_COSTS.displayValue, this.sampleData.schoolCosts.amount, this.sampleData.schoolCosts.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, this.sampleData.foodAndHousekeeping.amount, this.sampleData.foodAndHousekeeping.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.TV_AND_BROADBAND.displayValue, this.sampleData.tvAndBroadband.amount, this.sampleData.tvAndBroadband.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.HIRE_PURCHASES.displayValue, this.sampleData.hirePurchase.amount, this.sampleData.hirePurchase.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.MOBILE_PHONE.displayValue, this.sampleData.mobilePhone.amount, this.sampleData.mobilePhone.schedule),
    undefined, new ExpenseSource(MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, this.sampleData.maintenance.amount, this.sampleData.maintenance.schedule)
  )
}

function forFromObjectMethod () {
  return {
    mortgageDeclared: this.sampleData.mortgageDeclared,
    mortgage: {
      amount: this.sampleData.mortgage.amount,
      schedule: this.sampleData.mortgage.schedule.value
    },
    rentDeclared: this.sampleData.rentDeclared,
    rent: {
      amount: this.sampleData.rent.amount,
      schedule: this.sampleData.rent.schedule.value
    },
    councilTaxDeclared: this.sampleData.councilTaxDeclared,
    councilTax: {
      amount: this.sampleData.councilTax.amount,
      schedule: this.sampleData.councilTax.schedule.value
    },
    gasDeclared: this.sampleData.gasDeclared,
    gas: {
      amount: this.sampleData.gas.amount,
      schedule: this.sampleData.gas.schedule.value
    },
    electricityDeclared: this.sampleData.electricityDeclared,
    electricity: {
      amount: this.sampleData.electricity.amount,
      schedule: this.sampleData.electricity.schedule.value
    },
    waterDeclared: this.sampleData.waterDeclared,
    water: {
      amount: this.sampleData.water.amount,
      schedule: this.sampleData.water.schedule.value
    },
    travelDeclared: this.sampleData.travelDeclared,
    travel: {
      amount: this.sampleData.travel.amount,
      schedule: this.sampleData.travel.schedule.value
    },
    schoolCostsDeclared: this.sampleData.schoolCostsDeclared,
    schoolCosts: {
      amount: this.sampleData.schoolCosts.amount,
      schedule: this.sampleData.schoolCosts.schedule.value
    },
    foodAndHousekeepingDeclared: this.sampleData.foodAndHousekeepingDeclared,
    foodAndHousekeeping: {
      amount: this.sampleData.foodAndHousekeeping.amount,
      schedule: this.sampleData.foodAndHousekeeping.schedule.value
    },
    tvAndBroadbandDeclared: this.sampleData.tvAndBroadbandDeclared,
    tvAndBroadband: {
      amount: this.sampleData.tvAndBroadband.amount,
      schedule: this.sampleData.tvAndBroadband.schedule.value
    },
    hirePurchaseDeclared: this.sampleData.hirePurchaseDeclared,
    hirePurchase: {
      amount: this.sampleData.hirePurchase.amount,
      schedule: this.sampleData.hirePurchase.schedule.value
    },
    mobilePhoneDeclared: this.sampleData.mobilePhoneDeclared,
    mobilePhone: {
      amount: this.sampleData.mobilePhone.amount,
      schedule: this.sampleData.mobilePhone.schedule.value
    },
    maintenanceDeclared: this.sampleData.maintenanceDeclared,
    maintenance: {
      amount: this.sampleData.maintenance.amount,
      schedule: this.sampleData.maintenance.schedule.value
    }
  }
}

function forDeserialize () {
  return {
    mortgageDeclared: this.sampleData.mortgageDeclared,
    mortgage: {
      name: MonthlyExpenseType.MORTGAGE.displayValue,
      amount: this.sampleData.mortgage.amount,
      schedule: this.sampleData.mortgage.schedule
    },
    rentDeclared: this.sampleData.rentDeclared,
    rent: {
      name: MonthlyExpenseType.RENT.displayValue,
      amount: this.sampleData.rent.amount,
      schedule: this.sampleData.rent.schedule
    },
    councilTaxDeclared: this.sampleData.councilTaxDeclared,
    councilTax: {
      name: MonthlyExpenseType.COUNCIL_TAX.displayValue,
      amount: this.sampleData.councilTax.amount,
      schedule: this.sampleData.councilTax.schedule
    },
    gasDeclared: this.sampleData.gasDeclared,
    gas: {
      name: MonthlyExpenseType.GAS.displayValue,
      amount: this.sampleData.gas.amount,
      schedule: this.sampleData.gas.schedule
    },
    electricityDeclared: this.sampleData.electricityDeclared,
    electricity: {
      name: MonthlyExpenseType.ELECTRICITY.displayValue,
      amount: this.sampleData.electricity.amount,
      schedule: this.sampleData.electricity.schedule
    },
    waterDeclared: this.sampleData.waterDeclared,
    water: {
      name: MonthlyExpenseType.WATER.displayValue,
      amount: this.sampleData.water.amount,
      schedule: this.sampleData.water.schedule
    },
    travelDeclared: this.sampleData.travelDeclared,
    travel: {
      name: MonthlyExpenseType.TRAVEL.displayValue,
      amount: this.sampleData.travel.amount,
      schedule: this.sampleData.travel.schedule
    },
    schoolCostsDeclared: this.sampleData.schoolCostsDeclared,
    schoolCosts: {
      name: MonthlyExpenseType.SCHOOL_COSTS.displayValue,
      amount: this.sampleData.schoolCosts.amount,
      schedule: this.sampleData.schoolCosts.schedule
    },
    foodAndHousekeepingDeclared: this.sampleData.foodAndHousekeepingDeclared,
    foodAndHousekeeping: {
      name: MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue,
      amount: this.sampleData.foodAndHousekeeping.amount,
      schedule: this.sampleData.foodAndHousekeeping.schedule
    },
    tvAndBroadbandDeclared: this.sampleData.tvAndBroadbandDeclared,
    tvAndBroadband: {
      name: MonthlyExpenseType.TV_AND_BROADBAND.displayValue,
      amount: this.sampleData.tvAndBroadband.amount,
      schedule: this.sampleData.tvAndBroadband.schedule
    },
    hirePurchaseDeclared: this.sampleData.hirePurchaseDeclared,
    hirePurchase: {
      name: MonthlyExpenseType.HIRE_PURCHASES.displayValue,
      amount: this.sampleData.hirePurchase.amount,
      schedule: this.sampleData.hirePurchase.schedule
    },
    mobilePhoneDeclared: this.sampleData.mobilePhoneDeclared,
    mobilePhone: {
      name: MonthlyExpenseType.MOBILE_PHONE.displayValue,
      amount: this.sampleData.mobilePhone.amount,
      schedule: this.sampleData.mobilePhone.schedule
    },
    maintenanceDeclared: this.sampleData.maintenanceDeclared,
    maintenance: {
      name: MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue,
      amount: this.sampleData.maintenance.amount,
      schedule: this.sampleData.maintenance.schedule
    },
    other: [{}]
  }
}

describe('MonthlyExpenses', () => {
  describe('fromObject', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(MonthlyExpenses.fromObject(undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(MonthlyExpenses.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(MonthlyExpenses.fromObject({})).to.deep.equal(
        new MonthlyExpenses(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined
        )
      )
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const sampleMonthlyExpensesData = getSampleMonthlyExpensesObject().forFromObjectMethod()
      const expectedMonthlyExpensesObject = getSampleMonthlyExpensesObject().forConstructor()

      expect(MonthlyExpenses.fromObject(sampleMonthlyExpensesData)).to.deep.equal(expectedMonthlyExpensesObject)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyExpenses().deserialize(undefined)).to.deep.equal(new MonthlyExpenses())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyExpenses().deserialize(getSampleMonthlyExpensesObject().forDeserialize())).to.deep.equal(getSampleMonthlyExpensesObject().forConstructor())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when `ExpenseSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyExpenses(
            undefined, new ExpenseSource(MonthlyExpenseType.MORTGAGE.displayValue, -100, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.RENT.displayValue, -200, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.COUNCIL_TAX.displayValue, -300, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.GAS.displayValue, -400, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.ELECTRICITY.displayValue, -500, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.WATER.displayValue, -600, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.TRAVEL.displayValue, -700, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.SCHOOL_COSTS.displayValue, -800, IncomeExpenseSchedule.MONTH),
            undefined, new ExpenseSource(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue, -900, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.TV_AND_BROADBAND.displayValue, -100, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.HIRE_PURCHASES.displayValue, -100, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.MOBILE_PHONE.displayValue, -100, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new ExpenseSource(MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue, -100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(13)
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.MORTGAGE.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.RENT.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.COUNCIL_TAX.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.GAS.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.ELECTRICITY.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.WATER.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.TRAVEL.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.SCHOOL_COSTS.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.FOOD_HOUSEKEEPING.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.TV_AND_BROADBAND.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.HIRE_PURCHASES.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.MOBILE_PHONE.displayValue))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyExpenseType.MAINTENANCE_PAYMENTS.displayValue))
      })

      describe('when successful', () => {
        it('should return no error when `hasSource` is true and `source` is invalid', () => {
          const sampleMonthlyExpensesData = getSampleMonthlyExpensesObject().forFromObjectMethod()

          const errors = validator.validateSync(sampleMonthlyExpensesData)
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
