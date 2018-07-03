import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/MonthlyIncome'
import { MonthlyIncomeSource, ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncomeSource'

function getSampleMonthtlyIncomeObject (options?: object) {
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
    new MonthlyIncomeSource(SourceNames.SALARY, this.sampleData.salarySource.amount, this.sampleData.salarySource.schedule),
    new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, this.sampleData.universalCreditSource.amount, this.sampleData.universalCreditSource.schedule),
    new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, this.sampleData.jobseekerAllowanceIncomeSource.amount, this.sampleData.jobseekerAllowanceIncomeSource.schedule),
    new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, this.sampleData.jobseekerAllowanceContributionSource.amount, this.sampleData.jobseekerAllowanceContributionSource.schedule),
    new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, this.sampleData.incomeSupportSource.amount, this.sampleData.incomeSupportSource.schedule),
    new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, this.sampleData.workingTaxCreditSource.amount, this.sampleData.workingTaxCreditSource.schedule),
    new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, this.sampleData.childTaxCreditSource.amount, this.sampleData.childTaxCreditSource.schedule),
    new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, this.sampleData.childBenefitSource.amount, this.sampleData.childBenefitSource.schedule),
    new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, this.sampleData.councilTaxSupportSource.amount, this.sampleData.councilTaxSupportSource.schedule),
    new MonthlyIncomeSource(SourceNames.PENSION, this.sampleData.pensionSource.amount, this.sampleData.pensionSource.schedule)
  )
}

function forFromObjectMethod () {
  return {
    hasSalarySource: this.sampleData.hasSalarySource,
    salarySource: {
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule.value
    },
    hasUniversalCreditSource: this.sampleData.hasUniversalCreditSource,
    universalCreditSource: {
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule.value
    },
    hasJobseekerAllowanceIncomeSource: this.sampleData.hasJobseekerAllowanceIncomeSource,
    jobseekerAllowanceIncomeSource: {
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule.value
    },
    hasJobseekerAllowanceContributionSource: this.sampleData.hasJobseekerAllowanceContributionSource,
    jobseekerAllowanceContributionSource: {
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule.value
    },
    hasIncomeSupportSource: this.sampleData.hasIncomeSupportSource,
    incomeSupportSource: {
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule.value
    },
    hasWorkingTaxCreditSource: this.sampleData.hasWorkingTaxCreditSource,
    workingTaxCreditSource: {
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule.value
    },
    hasChildTaxCreditSource: this.sampleData.hasChildTaxCreditSource,
    childTaxCreditSource: {
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule.value
    },
    hasChildBenefitSource: this.sampleData.hasChildBenefitSource,
    childBenefitSource: {
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule.value
    },
    hasCouncilTaxSupportSource: this.sampleData.hasCouncilTaxSupportSource,
    councilTaxSupportSource: {
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule.value
    },
    hasPensionSource: this.sampleData.hasPensionSource,
    pensionSource: {
      amount: this.sampleData.pensionSource.amount,
      schedule: this.sampleData.pensionSource.schedule.value
    }
  }
}

function forDeserialize () {
  return {
    hasSalarySource: this.sampleData.hasSalarySource,
    salarySource: {
      name: SourceNames.SALARY,
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule
    },
    hasUniversalCreditSource: this.sampleData.hasUniversalCreditSource,
    universalCreditSource: {
      name: SourceNames.UNIVERSAL_CREDIT,
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule
    },
    hasJobseekerAllowanceIncomeSource: this.sampleData.hasJobseekerAllowanceIncomeSource,
    jobseekerAllowanceIncomeSource: {
      name: SourceNames.JOBSEEKER_ALLOWANE_INCOME,
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule
    },
    hasJobseekerAllowanceContributionSource: this.sampleData.hasJobseekerAllowanceContributionSource,
    jobseekerAllowanceContributionSource: {
      name: SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION,
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule
    },
    hasIncomeSupportSource: this.sampleData.hasIncomeSupportSource,
    incomeSupportSource: {
      name: SourceNames.INCOME_SUPPORT,
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule
    },
    hasWorkingTaxCreditSource: this.sampleData.hasWorkingTaxCreditSource,
    workingTaxCreditSource: {
      name: SourceNames.WORKING_TAX_CREDIT,
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule
    },
    hasChildTaxCreditSource: this.sampleData.hasChildTaxCreditSource,
    childTaxCreditSource: {
      name: SourceNames.CHILD_TAX_CREDIT,
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule
    },
    hasChildBenefitSource: this.sampleData.hasChildBenefitSource,
    childBenefitSource: {
      name: SourceNames.CHILD_BENEFIT,
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule
    },
    hasCouncilTaxSupportSource: this.sampleData.hasCouncilTaxSupportSource,
    councilTaxSupportSource: {
      name: SourceNames.COUNCIL_TAX_SUPPORT,
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule
    },
    hasPensionSource: this.sampleData.hasPensionSource,
    pensionSource: {
      name: SourceNames.PENSION,
      amount: this.sampleData.pensionSource.amount,
      schedule: this.sampleData.pensionSource.schedule
    }
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
          undefined
        )
      )
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const sampleMonthtlyIncomeData = getSampleMonthtlyIncomeObject().forFromObjectMethod()
      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject().forConstructor()

      expect(MonthlyIncome.fromObject(sampleMonthtlyIncomeData)).to.deep.equal(expectedMonthtlyIncomeObject)
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
      it('should return errors when `MonthlyIncomeSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            new MonthlyIncomeSource(SourceNames.SALARY, -100, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, -200, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, -300, IncomeExpenseSchedule.TWO_WEEKS),
            new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, -400, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, -500, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, -600, IncomeExpenseSchedule.TWO_WEEKS),
            new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, -700, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, -800, IncomeExpenseSchedule.MONTH),
            new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, -900, IncomeExpenseSchedule.TWO_WEEKS),
            new MonthlyIncomeSource(SourceNames.PENSION, -100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.SALARY))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.UNIVERSAL_CREDIT))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_INCOME))
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION))
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
        const sampleMonthtlyIncomeData = getSampleMonthtlyIncomeObject().forFromObjectMethod()

        const errors = validator.validateSync(sampleMonthtlyIncomeData)
        expect(errors.length).to.equal(0)
      })
    })
  })
})
