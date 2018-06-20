import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/MonthlyIncome'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/MonthlyIncomeSource'
import { ValidationErrors as MonthlyIncomeValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncome'
import { ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncomeSource'

const SAMPLE_INVALID_MONTHLY_INCOME_SOURCE =
  new MonthlyIncomeSource(
    SourceNames.SALARY,
    -100,
    IncomeExpenseSchedule.MONTH
  )

const SAMPLE_VALID_MONTHLY_INCOME =
  new MonthlyIncome(
    true, new MonthlyIncomeSource(SourceNames.SALARY, 100, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, 200, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, 300, IncomeExpenseSchedule.TWO_WEEKS),
    true, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, 400, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, 500, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, 600, IncomeExpenseSchedule.TWO_WEEKS),
    true, new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, 700, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, 800, IncomeExpenseSchedule.MONTH),
    true, new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, 900, IncomeExpenseSchedule.TWO_WEEKS),
    true, new MonthlyIncomeSource(SourceNames.PENSION, 100, IncomeExpenseSchedule.TWO_WEEKS)
  )

const SAMPLE_VALID_MONTHLY_INCOME_FROM_OBJECT = {
  hasSalarySource: true,
  salarySource: {
    amount: 100,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasUniversalCreditSource: true,
  universalCreditSource: {
    amount: 200,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasJobseekerAllowanceIncomeSource: true,
  jobseekerAllowanceIncomeSource: {
    amount: 300,
    schedule: IncomeExpenseSchedule.TWO_WEEKS.value
  },
  hasJobseekerAllowanceContributionSource: true,
  jobseekerAllowanceContributionSource: {
    amount: 400,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasIncomeSupportSource: true,
  incomeSupportSource: {
    amount: 500,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasWorkingTaxCreditSource: true,
  workingTaxCreditSource: {
    amount: 600,
    schedule: IncomeExpenseSchedule.TWO_WEEKS.value
  },
  hasChildTaxCreditSource: true,
  childTaxCreditSource: {
    amount: 700,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasChildBenefitSource: true,
  childBenefitSource: {
    amount: 800,
    schedule: IncomeExpenseSchedule.MONTH.value
  },
  hasCouncilTaxSupportSource: true,
  councilTaxSupportSource: {
    amount: 900,
    schedule: IncomeExpenseSchedule.TWO_WEEKS.value
  },
  hasPensionSource: true,
  pensionSource: {
    amount: 100,
    schedule: IncomeExpenseSchedule.TWO_WEEKS.value
  }
}

const SAMPLE_VALID_MONTHLY_INCOME_DESERIALIZE = {
  hasSalarySource: true,
  salarySource: {
    name: SourceNames.SALARY,
    amount: 100,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasUniversalCreditSource: true,
  universalCreditSource: {
    name: SourceNames.UNIVERSAL_CREDIT,
    amount: 200,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasJobseekerAllowanceIncomeSource: true,
  jobseekerAllowanceIncomeSource: {
    name: SourceNames.JOBSEEKER_ALLOWANE_INCOME,
    amount: 300,
    schedule: {
      value: IncomeExpenseSchedule.TWO_WEEKS.value,
      displayValue: IncomeExpenseSchedule.TWO_WEEKS.displayValue
    }
  },
  hasJobseekerAllowanceContributionSource: true,
  jobseekerAllowanceContributionSource: {
    name: SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION,
    amount: 400,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasIncomeSupportSource: true,
  incomeSupportSource: {
    name: SourceNames.INCOME_SUPPORT,
    amount: 500,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasWorkingTaxCreditSource: true,
  workingTaxCreditSource: {
    name: SourceNames.WORKING_TAX_CREDIT,
    amount: 600,
    schedule: {
      value: IncomeExpenseSchedule.TWO_WEEKS.value,
      displayValue: IncomeExpenseSchedule.TWO_WEEKS.displayValue
    }
  },
  hasChildTaxCreditSource: true,
  childTaxCreditSource: {
    name: SourceNames.CHILD_TAX_CREDIT,
    amount: 700,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasChildBenefitSource: true,
  childBenefitSource: {
    name: SourceNames.CHILD_BENEFIT,
    amount: 800,
    schedule: {
      value: IncomeExpenseSchedule.MONTH.value,
      displayValue: IncomeExpenseSchedule.MONTH.displayValue
    }
  },
  hasCouncilTaxSupportSource: true,
  councilTaxSupportSource: {
    name: SourceNames.COUNCIL_TAX_SUPPORT,
    amount: 900,
    schedule: {
      value: IncomeExpenseSchedule.TWO_WEEKS.value,
      displayValue: IncomeExpenseSchedule.TWO_WEEKS.displayValue
    }
  },
  hasPensionSource: true,
  pensionSource: {
    name: SourceNames.PENSION,
    amount: 100,
    schedule: {
      value: IncomeExpenseSchedule.TWO_WEEKS.value,
      displayValue: IncomeExpenseSchedule.TWO_WEEKS.displayValue
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
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined,
          false, undefined
        )
      )
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(MonthlyIncome.fromObject(SAMPLE_VALID_MONTHLY_INCOME_FROM_OBJECT)).to.deep.equal(SAMPLE_VALID_MONTHLY_INCOME)
    })
  })

  describe('deserialize', () => {
    it('should return instance initialised with defaults when undefined provided', () => {
      expect(new MonthlyIncome().deserialize(undefined)).to.deep.equal(new MonthlyIncome())
    })

    it('should return instance initialised with set fields from object provided', () => {
      expect(new MonthlyIncome().deserialize(SAMPLE_VALID_MONTHLY_INCOME_DESERIALIZE)).to.deep.equal(SAMPLE_VALID_MONTHLY_INCOME)
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {
      it('should return errors when all are undefined', () => {
        const errors = validator.validateSync(new MonthlyIncome(undefined))
        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.SALARY))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.UNIVERSAL_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_INCOME))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.INCOME_SUPPORT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.WORKING_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_BENEFIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.COUNCIL_TAX_SUPPORT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.PENSION))
      })

      it('should return errors when required objects are undefined', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            undefined, new MonthlyIncomeSource(SourceNames.SALARY, 100, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, 200, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, 300, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, 400, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, 500, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, 600, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, 700, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, 800, IncomeExpenseSchedule.MONTH),
            undefined, new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, 900, IncomeExpenseSchedule.TWO_WEEKS),
            undefined, new MonthlyIncomeSource(SourceNames.PENSION, 100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.SALARY))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.UNIVERSAL_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_INCOME))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.INCOME_SUPPORT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.WORKING_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_TAX_CREDIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.CHILD_BENEFIT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.COUNCIL_TAX_SUPPORT))
        expectValidationError(errors, MonthlyIncomeValidationErrors.BOOLEAN_REQUIRED(SourceNames.PENSION))
      })

      it('should return errors when `MonthlyIncomeSource` objects are invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            true, new MonthlyIncomeSource(SourceNames.SALARY, -100, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, -200, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, -300, IncomeExpenseSchedule.TWO_WEEKS),
            true, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, -400, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, -500, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, -600, IncomeExpenseSchedule.TWO_WEEKS),
            true, new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, -700, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, -800, IncomeExpenseSchedule.MONTH),
            true, new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, -900, IncomeExpenseSchedule.TWO_WEEKS),
            true, new MonthlyIncomeSource(SourceNames.PENSION, -100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )

        expect(errors.length).to.equal(10)
        expectValidationError(errors, MonthlyIncomeSourceValidationErrors.AMOUNT_NON_NEGATIVE_NUMBER_REQUIRED(SourceNames.SALARY))

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
        const errors = validator.validateSync(SAMPLE_VALID_MONTHLY_INCOME)
        expect(errors.length).to.equal(0)
      })

      it('should return no error when `hasSource` is false even if `source` is invalid', () => {
        const errors = validator.validateSync(
          new MonthlyIncome(
            false, new MonthlyIncomeSource(SourceNames.SALARY, -100, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, -200, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, -300, IncomeExpenseSchedule.TWO_WEEKS),
            false, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, -400, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, -500, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, -600, IncomeExpenseSchedule.TWO_WEEKS),
            false, new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, -700, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, -800, IncomeExpenseSchedule.MONTH),
            false, new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, -900, IncomeExpenseSchedule.TWO_WEEKS),
            false, new MonthlyIncomeSource(SourceNames.PENSION, -100, IncomeExpenseSchedule.TWO_WEEKS)
          )
        )
        expect(errors.length).to.equal(0)
      })
    })
  })
})
