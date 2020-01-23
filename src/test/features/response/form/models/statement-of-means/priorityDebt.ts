import { Validator } from '@hmcts/class-validator'
import { PriorityDebt } from 'response/form/models/statement-of-means/priorityDebt'
import { PriorityDebtType } from 'response/form/models/statement-of-means/priorityDebtType'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { expect } from 'chai'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ValidationErrors, ExpenseSource } from 'response/form/models/statement-of-means/expenseSource'

function getSamplePriorityDebtObject () {
  const sampleData = {
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
    maintenance: {
      amount: 700,
      schedule: IncomeExpenseSchedule.WEEK
    }
  }

  return {
    sampleData,
    forConstructor: forConstructor,
    forFromObject: forFromObject,
    forDeserialize: forDeserialize
  }
}

function forConstructor (): PriorityDebt {
  return new PriorityDebt(true, new ExpenseSource(PriorityDebtType.MORTGAGE.displayValue,
    this.sampleData.mortgage.amount, this.sampleData.mortgage.schedule),
    true, new ExpenseSource(PriorityDebtType.RENT.displayValue, this.sampleData.rent.amount,
      this.sampleData.rent.schedule),
    true, new ExpenseSource(PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue,
      this.sampleData.councilTax.amount, this.sampleData.councilTax.schedule),
    true, new ExpenseSource(PriorityDebtType.GAS.displayValue, this.sampleData.gas.amount,
      this.sampleData.gas.schedule),
    true, new ExpenseSource(PriorityDebtType.ELECTRICITY.displayValue,
      this.sampleData.electricity.amount, this.sampleData.electricity.schedule),
    true, new ExpenseSource(PriorityDebtType.WATER.displayValue, this.sampleData.water.amount,
      this.sampleData.water.schedule),
    true, new ExpenseSource(PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue,
      this.sampleData.maintenance.amount, this.sampleData.maintenance.schedule))
}

function forDeserialize () {
  return {
    mortgageDeclared: true,
    mortgage: {
      name: PriorityDebtType.MORTGAGE.displayValue,
      amount: this.sampleData.mortgage.amount,
      schedule: this.sampleData.mortgage.schedule
    },
    rentDeclared: true,
    rent: {
      name: PriorityDebtType.RENT.displayValue,
      amount: this.sampleData.rent.amount,
      schedule: this.sampleData.rent.schedule
    },
    councilTaxDeclared: true,
    councilTax: {
      name: PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue,
      amount: this.sampleData.councilTax.amount,
      schedule: this.sampleData.councilTax.schedule
    },
    gasDeclared: true,
    gas: {
      name: PriorityDebtType.GAS.displayValue,
      amount: this.sampleData.gas.amount,
      schedule: this.sampleData.gas.schedule
    },
    electricityDeclared: true,
    electricity: {
      name: PriorityDebtType.ELECTRICITY.displayValue,
      amount: this.sampleData.electricity.amount,
      schedule: this.sampleData.electricity.schedule
    },
    waterDeclared: true,
    water: {
      name: PriorityDebtType.WATER.displayValue,
      amount: this.sampleData.water.amount,
      schedule: this.sampleData.water.schedule
    },
    maintenanceDeclared: true,
    maintenance: {
      name: PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue,
      amount: this.sampleData.maintenance.amount,
      schedule: this.sampleData.maintenance.schedule
    }

  }
}

function forFromObject () {
  return {
    mortgageDeclared: true,
    mortgage: {
      amount: this.sampleData.mortgage.amount,
      schedule: this.sampleData.mortgage.schedule.value
    },
    rentDeclared: true,
    rent: {
      amount: this.sampleData.rent.amount,
      schedule: this.sampleData.rent.schedule.value
    },
    councilTaxDeclared: true,
    councilTax: {
      amount: this.sampleData.councilTax.amount,
      schedule: this.sampleData.councilTax.schedule.value
    },
    gasDeclared: true,
    gas: {
      amount: this.sampleData.gas.amount,
      schedule: this.sampleData.gas.schedule.value
    },
    electricityDeclared: true,
    electricity: {
      amount: this.sampleData.electricity.amount,
      schedule: this.sampleData.electricity.schedule.value
    },
    waterDeclared: true,
    water: {
      amount: this.sampleData.water.amount,
      schedule: this.sampleData.water.schedule.value
    },
    maintenanceDeclared: true,
    maintenance: {
      amount: this.sampleData.maintenance.amount,
      schedule: this.sampleData.maintenance.schedule.value
    }

  }
}

describe('PriorityDebt', () => {
  describe('deserialize', () => {
    it('should return instance initialised with default values when undefined provided', () => {
      expect(new PriorityDebt().deserialize(undefined)).to.deep.equal(new PriorityDebt())
    })

    it('should return instance initialised with given values when given an object', () => {
      expect(new PriorityDebt().deserialize(getSamplePriorityDebtObject().forDeserialize()))
        .to.deep.equal(getSamplePriorityDebtObject().forConstructor())
    })
  })

  describe('fromObject', () => {
    it('should return undefined when given undefined', () => {
      expect(PriorityDebt.fromObject(undefined)).to.equal(undefined)
    })

    it('should return undefined when given no parameter', () => {
      expect(PriorityDebt.fromObject()).to.equal(undefined)
    })

    it('should return a new instance with defaults when an empty object is provided', () => {
      expect(PriorityDebt.fromObject({})).to.deep.equal(
        new PriorityDebt(undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined,
          undefined, undefined, undefined, undefined,
          undefined, undefined)
      )
    })

    it('should return a new instance with fields containing values from the given object', () => {
      expect(PriorityDebt.fromObject(getSamplePriorityDebtObject().forFromObject()))
        .to.deep.equal(getSamplePriorityDebtObject().forConstructor())
    })
  })

  describe('when validated', () => {
    const validator: Validator = new Validator()

    it('Should return validation errors for each field that is invalid', () => {
      const errors = validator.validateSync(new PriorityDebt(
        undefined, new ExpenseSource(PriorityDebtType.MORTGAGE.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.RENT.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.GAS.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.ELECTRICITY.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.WATER.displayValue, -1, IncomeExpenseSchedule.WEEK),
        undefined, new ExpenseSource(PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, -1, IncomeExpenseSchedule.WEEK)
      ))
      expect(errors.length).to.be.equal(PriorityDebtType.all().length)

      PriorityDebtType.all().forEach(value => {
        expectValidationError(errors, ValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(value.displayValue))
      })
    })

    it('should return no error when successful', () => {
      const errors = validator.validateSync(new PriorityDebt(
        true, new ExpenseSource(PriorityDebtType.MORTGAGE.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.RENT.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.COUNCIL_TAX_COMMUNITY_CHARGE.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.GAS.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.ELECTRICITY.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.WATER.displayValue, 1, IncomeExpenseSchedule.WEEK),
        true, new ExpenseSource(PriorityDebtType.MAINTENANCE_PAYMENTS.displayValue, 1, IncomeExpenseSchedule.WEEK)
      ))
      expect(errors.length).to.be.equal(0)
    })
  })
})
