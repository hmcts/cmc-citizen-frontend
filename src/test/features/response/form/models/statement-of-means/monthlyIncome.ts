import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncome } from 'response/form/models/statement-of-means/monthlyIncome'
import { MonthlyIncomeType } from 'response/form/models/statement-of-means/monthlyIncomeType'
import { IncomeSource, ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/incomeSource'

function getSampleMonthlyIncomeObject (options?: object) {
  const DEFAULT_SAMPLE_VALID_MONTHLY_INCOME = {
    salarySource: {
      amount: 100,
      schedule: IncomeExpenseSchedule.MONTH
    },
    universalCreditSource: {
      amount: 200,
      schedule: IncomeExpenseSchedule.MONTH
    },
    jobseekerAllowanceIncomeSource: {
      amount: 300,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    jobseekerAllowanceContributionSource: {
      amount: 400,
      schedule: IncomeExpenseSchedule.MONTH
    },
    incomeSupportSource: {
      amount: 500,
      schedule: IncomeExpenseSchedule.MONTH
    },
    workingTaxCreditSource: {
      amount: 600,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    childTaxCreditSource: {
      amount: 700,
      schedule: IncomeExpenseSchedule.MONTH
    },
    childBenefitSource: {
      amount: 800,
      schedule: IncomeExpenseSchedule.MONTH
    },
    councilTaxSupportSource: {
      amount: 900,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    pensionSource: {
      amount: 100,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
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
  return new MonthlyIncome(
    undefined, new IncomeSource(MonthlyIncomeType.JOB.displayValue, this.sampleData.salarySource.amount, this.sampleData.salarySource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, this.sampleData.universalCreditSource.amount, this.sampleData.universalCreditSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, this.sampleData.jobseekerAllowanceIncomeSource.amount, this.sampleData.jobseekerAllowanceIncomeSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, this.sampleData.jobseekerAllowanceContributionSource.amount, this.sampleData.jobseekerAllowanceContributionSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.INCOME_SUPPORT.displayValue, this.sampleData.incomeSupportSource.amount, this.sampleData.incomeSupportSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, this.sampleData.workingTaxCreditSource.amount, this.sampleData.workingTaxCreditSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, this.sampleData.childTaxCreditSource.amount, this.sampleData.childTaxCreditSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.CHILD_BENEFIT.displayValue, this.sampleData.childBenefitSource.amount, this.sampleData.childBenefitSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, this.sampleData.councilTaxSupportSource.amount, this.sampleData.councilTaxSupportSource.schedule),
    undefined, new IncomeSource(MonthlyIncomeType.PENSION.displayValue, this.sampleData.pensionSource.amount, this.sampleData.pensionSource.schedule)
  )
}

function forFromObjectMethod () {
  return {
    salarySourceDeclared: this.sampleData.salarySourceDeclared,
    salarySource: {
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule.value
    },
    universalCreditSourceDeclared: this.sampleData.universalCreditSourceDeclared,
    universalCreditSource: {
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule.value
    },
    jobseekerAllowanceIncomeSourceDeclared: this.sampleData.jobseekerAllowanceIncomeSourceDeclared,
    jobseekerAllowanceIncomeSource: {
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule.value
    },
    jobseekerAllowanceContributionSourceDeclared: this.sampleData.jobseekerAllowanceContributionSourceDeclared,
    jobseekerAllowanceContributionSource: {
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule.value
    },
    incomeSupportSourceDeclared: this.sampleData.incomeSupportSourceDeclared,
    incomeSupportSource: {
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule.value
    },
    workingTaxCreditSourceDeclared: this.sampleData.workingTaxCreditSourceDeclared,
    workingTaxCreditSource: {
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule.value
    },
    childTaxCreditSourceDeclared: this.sampleData.childTaxCreditSourceDeclared,
    childTaxCreditSource: {
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule.value
    },
    childBenefitSourceDeclared: this.sampleData.childBenefitSourceDeclared,
    childBenefitSource: {
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule.value
    },
    councilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
    councilTaxSupportSource: {
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule.value
    },
    pensionSourceDeclared: this.sampleData.pensionSourceDeclared,
    pensionSource: {
      amount: this.sampleData.pensionSource.amount,
      schedule: this.sampleData.pensionSource.schedule.value
    }
  }
}

function forDeserialize () {
  return {
    salarySourceDeclared: this.sampleData.salarySourceDeclared,
    salarySource: {
      name: MonthlyIncomeType.JOB.displayValue,
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule
    },
    universalCreditSourceDeclared: this.sampleData.universalCreditSourceDeclared,
    universalCreditSource: {
      name: MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue,
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule
    },
    jobseekerAllowanceIncomeSourceDeclared: this.sampleData.jobseekerAllowanceIncomeSourceDeclared,
    jobseekerAllowanceIncomeSource: {
      name: MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue,
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule
    },
    jobseekerAllowanceContributionSourceDeclared: this.sampleData.jobseekerAllowanceContributionSourceDeclared,
    jobseekerAllowanceContributionSource: {
      name: MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue,
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule
    },
    incomeSupportSourceDeclared: this.sampleData.incomeSupportSourceDeclared,
    incomeSupportSource: {
      name: MonthlyIncomeType.INCOME_SUPPORT.displayValue,
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule
    },
    workingTaxCreditSourceDeclared: this.sampleData.workingTaxCreditSourceDeclared,
    workingTaxCreditSource: {
      name: MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue,
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule
    },
    childTaxCreditSourceDeclared: this.sampleData.childTaxCreditSourceDeclared,
    childTaxCreditSource: {
      name: MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue,
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule
    },
    childBenefitSourceDeclared: this.sampleData.childBenefitSourceDeclared,
    childBenefitSource: {
      name: MonthlyIncomeType.CHILD_BENEFIT.displayValue,
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule
    },
    councilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
    councilTaxSupportSource: {
      name: MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue,
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule
    },
    pensionSourceDeclared: this.sampleData.pensionSourceDeclared,
    pensionSource: {
      name: MonthlyIncomeType.PENSION.displayValue,
      amount: this.sampleData.pensionSource.amount,
      schedule: this.sampleData.pensionSource.schedule
    },
    otherSources: [{}]
  }
}

describe('MonthlyIncome', () => {
  describe('fromObject', () => {
    it('should return undefined when undefined provided as object parameter', () => {
      expect(MonthlyIncome.fromObject(undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(MonthlyIncome.fromObject()).to.deep.equal(undefined)
    })

    it('should return a new instance initialised with defaults when an empty object parameter is provided', () => {
      expect(MonthlyIncome.fromObject({})).to.deep.equal(
        new MonthlyIncome(
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
      const sampleMonthlyIncomeData = getSampleMonthlyIncomeObject().forFromObjectMethod()
      const expectedMonthlyIncomeObject = getSampleMonthlyIncomeObject().forConstructor()

      expect(MonthlyIncome.fromObject(sampleMonthlyIncomeData)).to.deep.equal(expectedMonthlyIncomeObject)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyIncome().deserialize(undefined)).to.deep.equal(new MonthlyIncome())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyIncome().deserialize(getSampleMonthlyIncomeObject().forDeserialize())).to.deep.equal(getSampleMonthlyIncomeObject().forConstructor())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when `IncomeSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            undefined, new IncomeSource(MonthlyIncomeType.JOB.displayValue, -100, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue, -200, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue, -300, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeSource(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue, -400, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.INCOME_SUPPORT.displayValue, -500, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue, -600, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeSource(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue, -700, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.CHILD_BENEFIT.displayValue, -800, IncomeExpenseSchedule.MONTH),
            undefined, new IncomeSource(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue, -900, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeSource(MonthlyIncomeType.PENSION.displayValue, -100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.JOB.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.UNIVERSAL_CREDIT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_INCOME_BASES.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.JOB_SEEKERS_ALLOWANCE_CONTRIBUTION_BASED.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.INCOME_SUPPORT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.WORKING_TAX_CREDIT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.CHILD_TAX_CREDIT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.CHILD_BENEFIT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.COUNCIL_TAX_SUPPORT.displayValue))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(MonthlyIncomeType.PENSION.displayValue))
      })
    })

    describe('when successful', () => {
      it('should return no error when `hasSource` is true and `source` is invalid', () => {
        const sampleMonthlyIncomeData = getSampleMonthlyIncomeObject().forFromObjectMethod()

        const errors = validator.validateSync(sampleMonthlyIncomeData)
        expect(errors.length).to.equal(0)
      })
    })
  })
})
