import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/monthlyIncome'
import { IncomeExpenseSource, ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/incomeSource'

function getSampleMonthtlyIncomeObject (options?: object) {
  const DEFAULT_SAMPLE_VALID_MONTHLY_INCOME = {
    salarySource: {
      amount: 100,
      schedule: ExpenseSchedule.MONTH
    },
    universalCreditSource: {
      amount: 200,
      schedule: ExpenseSchedule.MONTH
    },
    jobseekerAllowanceIncomeSource: {
      amount: 300,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    jobseekerAllowanceContributionSource: {
      amount: 400,
      schedule: ExpenseSchedule.MONTH
    },
    incomeSupportSource: {
      amount: 500,
      schedule: ExpenseSchedule.MONTH
    },
    workingTaxCreditSource: {
      amount: 600,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    childTaxCreditSource: {
      amount: 700,
      schedule: ExpenseSchedule.MONTH
    },
    childBenefitSource: {
      amount: 800,
      schedule: ExpenseSchedule.MONTH
    },
    councilTaxSupportSource: {
      amount: 900,
      schedule: ExpenseSchedule.TWO_WEEKS
    },
    pensionSource: {
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
  return new MonthlyIncome(
    undefined, new IncomeExpenseSource(SourceNames.SALARY, this.sampleData.salarySource.amount, this.sampleData.salarySource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.UNIVERSAL_CREDIT, this.sampleData.universalCreditSource.amount, this.sampleData.universalCreditSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.JOBSEEKER_ALLOWANCE_INCOME, this.sampleData.jobseekerAllowanceIncomeSource.amount, this.sampleData.jobseekerAllowanceIncomeSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, this.sampleData.jobseekerAllowanceContributionSource.amount, this.sampleData.jobseekerAllowanceContributionSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.INCOME_SUPPORT, this.sampleData.incomeSupportSource.amount, this.sampleData.incomeSupportSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.WORKING_TAX_CREDIT, this.sampleData.workingTaxCreditSource.amount, this.sampleData.workingTaxCreditSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.CHILD_TAX_CREDIT, this.sampleData.childTaxCreditSource.amount, this.sampleData.childTaxCreditSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.CHILD_BENEFIT, this.sampleData.childBenefitSource.amount, this.sampleData.childBenefitSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.COUNCIL_TAX_SUPPORT, this.sampleData.councilTaxSupportSource.amount, this.sampleData.councilTaxSupportSource.schedule),
    undefined, new IncomeExpenseSource(SourceNames.PENSION, this.sampleData.pensionSource.amount, this.sampleData.pensionSource.schedule)
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
    cxouncilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
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
      name: SourceNames.SALARY,
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule
    },
    universalCreditSourceDeclared: this.sampleData.universalCreditSourceDeclared,
    universalCreditSource: {
      name: SourceNames.UNIVERSAL_CREDIT,
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule
    },
    jobseekerAllowanceIncomeSourceDeclared: this.sampleData.jobseekerAllowanceIncomeSourceDeclared,
    jobseekerAllowanceIncomeSource: {
      name: SourceNames.JOBSEEKER_ALLOWANCE_INCOME,
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule
    },
    jobseekerAllowanceContributionSourceDeclared: this.sampleData.jobseekerAllowanceContributionSourceDeclared,
    jobseekerAllowanceContributionSource: {
      name: SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION,
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule
    },
    incomeSupportSourceDeclared: this.sampleData.incomeSupportSourceDeclared,
    incomeSupportSource: {
      name: SourceNames.INCOME_SUPPORT,
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule
    },
    workingTaxCreditSourceDeclared: this.sampleData.workingTaxCreditSourceDeclared,
    workingTaxCreditSource: {
      name: SourceNames.WORKING_TAX_CREDIT,
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule
    },
    cildTaxCreditSourceDeclared: this.sampleData.cildTaxCreditSourceDeclared,
    childTaxCreditSource: {
      name: SourceNames.CHILD_TAX_CREDIT,
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule
    },
    childBenefitSourceDeclared: this.sampleData.childBenefitSourceDeclared,
    childBenefitSource: {
      name: SourceNames.CHILD_BENEFIT,
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule
    },
    councilTaxSupportSourceDeclared: this.sampleData.councilTaxSupportSourceDeclared,
    councilTaxSupportSource: {
      name: SourceNames.COUNCIL_TAX_SUPPORT,
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule
    },
    pensionSourceDeclared: this.sampleData.pensionSourceDeclared,
    pensionSource: {
      name: SourceNames.PENSION,
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
      const sampleMonthlyIncomeData = getSampleMonthtlyIncomeObject().forFromObjectMethod()
      const expectedMonthlyIncomeObject = getSampleMonthtlyIncomeObject().forConstructor()

      expect(MonthlyIncome.fromObject(sampleMonthlyIncomeData)).to.deep.equal(expectedMonthlyIncomeObject)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyIncome().deserialize(undefined)).to.deep.equal(new MonthlyIncome())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyIncome().deserialize(getSampleMonthtlyIncomeObject().forDeserialize())).to.deep.equal(getSampleMonthtlyIncomeObject().forConstructor())
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when `IncomeSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            undefined, new IncomeExpenseSource(SourceNames.SALARY, -100, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.UNIVERSAL_CREDIT, -200, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.JOBSEEKER_ALLOWANCE_INCOME, -300, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, -400, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.INCOME_SUPPORT, -500, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.WORKING_TAX_CREDIT, -600, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(SourceNames.CHILD_TAX_CREDIT, -700, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.CHILD_BENEFIT, -800, ExpenseSchedule.MONTH),
            undefined, new IncomeExpenseSource(SourceNames.COUNCIL_TAX_SUPPORT, -900, ExpenseSchedule.TWO_WEEKS),
            undefined, new IncomeExpenseSource(SourceNames.PENSION, -100, ExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.SALARY))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.UNIVERSAL_CREDIT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.JOBSEEKER_ALLOWANCE_INCOME))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.INCOME_SUPPORT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.WORKING_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.CHILD_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.CHILD_BENEFIT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.COUNCIL_TAX_SUPPORT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.PENSION))
      })
    })

    describe('when successful', () => {
      it('should return no error when `hasSource` is true and `source` is invalid', () => {
        const sampleMonthlyIncomeData = getSampleMonthtlyIncomeObject().forFromObjectMethod()

        const errors = validator.validateSync(sampleMonthlyIncomeData)
        expect(errors.length).to.equal(0)
      })
    })
  })
})
