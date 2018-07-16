import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'
import {
  IncomeExpenseSource,
  ValidationErrors as MonthlyExpensesSourceValidationErrors
} from 'response/form/models/statement-of-means/incomeExpenseSource'
import { FieldNames, MonthlyExpenses } from 'response/form/models/statement-of-means/monthlyExpenses'

function getSampleMonthtlyExpensesObject (options?: object) {
  const DEFAULT_SAMPLE_VALID_MONTHLY_INCOME = {
    mortgage: {
      amount: 100,
      schedule: ExpenseSchedule.MONTH
    },
    rent: {
      amount: 200,
      schedule: ExpenseSchedule.MONTH
    },
    councilTax: {
      amount: 300,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    gas: {
      amount: 400,
      schedule: ExpenseSchedule.MONTH
    },
    electricity: {
      amount: 500,
      schedule: ExpenseSchedule.MONTH
    },
    water: {
      amount: 600,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    travel: {
      amount: 700,
      schedule: ExpenseSchedule.MONTH
    },
    schoolCosts: {
      amount: 800,
      schedule: ExpenseSchedule.MONTH
    },
    foodAndHousekeeping: {
      amount: 900,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    tvAndBroadband: {
      amount: 100,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    hirePurchase: {
      amount: 100,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    mobilePhone: {
      amount: 100,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    maintenance: {
      amount: 100,
      schedule: ExpenseSchedule.TWO_WEEKS
    }
  }

  const sampleData = Object.assign({}, DEFAULT_SAMPLE_VALID_MONTHLY_INCOME, options || {})

  return {
    sampleData,
    forConstructor: forConstructor,
    forFromObjectMethod: forFromObjectMethod,
    forDeserialize: forDeserialize
  }
}

function forConstructor () {
  return new MonthlyExpenses(
    undefined, new IncomeExpenseSource(FieldNames.MORTGAGE, this.sampleData.mortgage.amount, this.sampleData.mortgage.schedule),
    undefined, new IncomeExpenseSource(FieldNames.RENT, this.sampleData.rent.amount, this.sampleData.rent.schedule),
    undefined, new IncomeExpenseSource(FieldNames.COUNCIL_TAX, this.sampleData.councilTax.amount, this.sampleData.councilTax.schedule),
    undefined, new IncomeExpenseSource(FieldNames.GAS, this.sampleData.gas.amount, this.sampleData.gas.schedule),
    undefined, new IncomeExpenseSource(FieldNames.ELECTRICITY, this.sampleData.electricity.amount, this.sampleData.electricity.schedule),
    undefined, new IncomeExpenseSource(FieldNames.WATER, this.sampleData.water.amount, this.sampleData.water.schedule),
    undefined, new IncomeExpenseSource(FieldNames.TRAVEL, this.sampleData.travel.amount, this.sampleData.travel.schedule),
    undefined, new IncomeExpenseSource(FieldNames.SCHOOL, this.sampleData.schoolCosts.amount, this.sampleData.schoolCosts.schedule),
    undefined, new IncomeExpenseSource(FieldNames.FOOD_AND_HOUSEKEEPING, this.sampleData.foodAndHousekeeping.amount, this.sampleData.foodAndHousekeeping.schedule),
    undefined, new IncomeExpenseSource(FieldNames.TV_AND_BROADBAND, this.sampleData.tvAndBroadband.amount, this.sampleData.tvAndBroadband.schedule),
    undefined, new IncomeExpenseSource(FieldNames.HIRE_PURCHASE, this.sampleData.hirePurchase.amount, this.sampleData.hirePurchase.schedule),
    undefined, new IncomeExpenseSource(FieldNames.MOBILE_PHONE, this.sampleData.mobilePhone.amount, this.sampleData.mobilePhone.schedule),
    undefined, new IncomeExpenseSource(FieldNames.MAINTENANCE, this.sampleData.maintenance.amount, this.sampleData.maintenance.schedule)
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
      name: FieldNames.MORTGAGE,
      amount: this.sampleData.mortgage.amount,
      schedule: this.sampleData.mortgage.schedule
    },
    rentDeclared: this.sampleData.rentDeclared,
    rent: {
      name: FieldNames.RENT,
      amount: this.sampleData.rent.amount,
      schedule: this.sampleData.rent.schedule
    },
    councilTaxDeclared: this.sampleData.councilTaxDeclared,
    councilTax: {
      name: FieldNames.COUNCIL_TAX,
      amount: this.sampleData.councilTax.amount,
      schedule: this.sampleData.councilTax.schedule
    },
    gasDeclared: this.sampleData.gasDeclared,
    gas: {
      name: FieldNames.GAS,
      amount: this.sampleData.gas.amount,
      schedule: this.sampleData.gas.schedule
    },
    electricityDeclared: this.sampleData.electricityDeclared,
    electricity: {
      name: FieldNames.ELECTRICITY,
      amount: this.sampleData.electricity.amount,
      schedule: this.sampleData.electricity.schedule
    },
    waterDeclared: this.sampleData.waterDeclared,
    water: {
      name: FieldNames.WATER,
      amount: this.sampleData.water.amount,
      schedule: this.sampleData.water.schedule
    },
    travelDeclared: this.sampleData.travelDeclared,
    travel: {
      name: FieldNames.TRAVEL,
      amount: this.sampleData.travel.amount,
      schedule: this.sampleData.travel.schedule
    },
    schoolCostsDeclared: this.sampleData.schoolCostsDeclared,
    schoolCosts: {
      name: FieldNames.SCHOOL,
      amount: this.sampleData.schoolCosts.amount,
      schedule: this.sampleData.schoolCosts.schedule
    },
    foodAndHousekeepingDeclared: this.sampleData.foodAndHousekeepingDeclared,
    foodAndHousekeeping: {
      name: FieldNames.FOOD_AND_HOUSEKEEPING,
      amount: this.sampleData.foodAndHousekeeping.amount,
      schedule: this.sampleData.foodAndHousekeeping.schedule
    },
    tvAndBroadbandDeclared: this.sampleData.tvAndBroadbandDeclared,
    tvAndBroadband: {
      name: FieldNames.TV_AND_BROADBAND,
      amount: this.sampleData.tvAndBroadband.amount,
      schedule: this.sampleData.tvAndBroadband.schedule
    },
    hirePurchaseDeclared: this.sampleData.hirePurchaseDeclared,
    hirePurchase: {
      name: FieldNames.HIRE_PURCHASE,
      amount: this.sampleData.hirePurchase.amount,
      schedule: this.sampleData.hirePurchase.schedule
    },
    mobilePhoneDeclared: this.sampleData.mobilePhoneDeclared,
    mobilePhone: {
      name: FieldNames.MOBILE_PHONE,
      amount: this.sampleData.mobilePhone.amount,
      schedule: this.sampleData.mobilePhone.schedule
    },
    maintenanceDeclared: this.sampleData.maintenanceDeclared,
    maintenance: {
      name: FieldNames.MAINTENANCE,
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
      const sampleMonthlyExpensesData = getSampleMonthtlyExpensesObject().forFromObjectMethod()
      const expectedMonthlyExpensesObject = getSampleMonthtlyExpensesObject().forConstructor()

      expect(MonthlyExpenses.fromObject(sampleMonthlyExpensesData)).to.deep.equal(expectedMonthlyExpensesObject)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyExpenses().deserialize(undefined)).to.deep.equal(new MonthlyExpenses())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyExpenses().deserialize(getSampleMonthtlyExpensesObject().forDeserialize())).to.deep.equal(getSampleMonthtlyExpensesObject().forConstructor())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when `IncomeSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyExpenses(
            undefined, new IncomeExpenseSource(FieldNames.MORTGAGE, -100, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.RENT, -200, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.COUNCIL_TAX, -300, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.GAS, -400, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.ELECTRICITY, -500, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.WATER, -600, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.TRAVEL, -700, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.SCHOOL, -800, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(FieldNames.FOOD_AND_HOUSEKEEPING, -900, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.TV_AND_BROADBAND, -100, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.HIRE_PURCHASE, -100, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.MOBILE_PHONE, -100, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(FieldNames.MAINTENANCE, -100, ExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(13)
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.MORTGAGE))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.RENT))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.COUNCIL_TAX))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.GAS))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.ELECTRICITY))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.WATER))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.TRAVEL))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.SCHOOL))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.FOOD_AND_HOUSEKEEPING))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.TV_AND_BROADBAND))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.HIRE_PURCHASE))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.MOBILE_PHONE))
        expectValidationError(errors, MonthlyExpensesSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(FieldNames.MAINTENANCE))
      })

      describe('when successful', () => {
        it('should return no error when `hasSource` is true and `source` is invalid', () => {
          const sampleMonthlyExpensesData = getSampleMonthtlyExpensesObject().forFromObjectMethod()

          const errors = validator.validateSync(sampleMonthlyExpensesData)
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})
