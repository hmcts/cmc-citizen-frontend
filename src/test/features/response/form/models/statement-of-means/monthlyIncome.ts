import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { IncomeExpenseSchedule } from 'response/form/models/statement-of-means/incomeExpenseSchedule'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/MonthlyIncome'
import { MonthlyIncomeSource } from 'response/form/models/statement-of-means/MonthlyIncomeSource'
import { ValidationErrors as MonthlyIncomeValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncome'
import { ValidationErrors as MonthlyIncomeSourceValidationErrors } from 'response/form/models/statement-of-means/MonthlyIncomeSource'

function getSampleMonthtlyIncomeObject (options?: object) {
  const DEFAULT_SAMPLE_VALID_MONTHLY_INCOME = {
    hasSalarySource: true,
    salarySource: {
      amount: 100,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasUniversalCreditSource: true,
    universalCreditSource: {
      amount: 200,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasJobseekerAllowanceIncomeSource: true,
    jobseekerAllowanceIncomeSource: {
      amount: 300,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    hasJobseekerAllowanceContributionSource: true,
    jobseekerAllowanceContributionSource: {
      amount: 400,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasIncomeSupportSource: true,
    incomeSupportSource: {
      amount: 500,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasWorkingTaxCreditSource: true,
    workingTaxCreditSource: {
      amount: 600,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    hasChildTaxCreditSource: true,
    childTaxCreditSource: {
      amount: 700,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasChildBenefitSource: true,
    childBenefitSource: {
      amount: 800,
      schedule: IncomeExpenseSchedule.MONTH
    },
    hasCouncilTaxSupportSource: true,
    councilTaxSupportSource: {
      amount: 900,
      schedule: IncomeExpenseSchedule.TWO_WEEKS
    },
    hasPensionSource: true,
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
    this.sampleData.hasSalarySource, new MonthlyIncomeSource(SourceNames.SALARY, this.sampleData.salarySource.amount, this.sampleData.salarySource.schedule),
    this.sampleData.hasUniversalCreditSource, new MonthlyIncomeSource(SourceNames.UNIVERSAL_CREDIT, this.sampleData.universalCreditSource.amount, this.sampleData.universalCreditSource.schedule),
    this.sampleData.hasJobseekerAllowanceIncomeSource, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_INCOME, this.sampleData.jobseekerAllowanceIncomeSource.amount, this.sampleData.jobseekerAllowanceIncomeSource.schedule),
    this.sampleData.hasJobseekerAllowanceContributionSource, new MonthlyIncomeSource(SourceNames.JOBSEEKER_ALLOWANE_CONTRIBUTION, this.sampleData.jobseekerAllowanceContributionSource.amount, this.sampleData.jobseekerAllowanceContributionSource.schedule),
    this.sampleData.hasIncomeSupportSource, new MonthlyIncomeSource(SourceNames.INCOME_SUPPORT, this.sampleData.incomeSupportSource.amount, this.sampleData.incomeSupportSource.schedule),
    this.sampleData.hasWorkingTaxCreditSource, new MonthlyIncomeSource(SourceNames.WORKING_TAX_CREDIT, this.sampleData.workingTaxCreditSource.amount, this.sampleData.workingTaxCreditSource.schedule),
    this.sampleData.hasChildTaxCreditSource, new MonthlyIncomeSource(SourceNames.CHILD_TAX_CREDIT, this.sampleData.childTaxCreditSource.amount, this.sampleData.childTaxCreditSource.schedule),
    this.sampleData.hasChildBenefitSource, new MonthlyIncomeSource(SourceNames.CHILD_BENEFIT, this.sampleData.childBenefitSource.amount, this.sampleData.childBenefitSource.schedule),
    this.sampleData.hasCouncilTaxSupportSource, new MonthlyIncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, this.sampleData.councilTaxSupportSource.amount, this.sampleData.councilTaxSupportSource.schedule),
    this.sampleData.hasPensionSource, new MonthlyIncomeSource(SourceNames.PENSION, this.sampleData.pensionSource.amount, this.sampleData.pensionSource.schedule)
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
      name: this.sampleData.salarySource.
      amount: this.sampleData.salarySource.amount,
      schedule: this.sampleData.salarySource.schedule
    },
    hasUniversalCreditSource: this.sampleData.hasUniversalCreditSource,
    universalCreditSource: {
      amount: this.sampleData.universalCreditSource.amount,
      schedule: this.sampleData.universalCreditSource.schedule
    },
    hasJobseekerAllowanceIncomeSource: this.sampleData.hasJobseekerAllowanceIncomeSource,
    jobseekerAllowanceIncomeSource: {
      amount: this.sampleData.jobseekerAllowanceIncomeSource.amount,
      schedule: this.sampleData.jobseekerAllowanceIncomeSource.schedule
    },
    hasJobseekerAllowanceContributionSource: this.sampleData.hasJobseekerAllowanceContributionSource,
    jobseekerAllowanceContributionSource: {
      amount: this.sampleData.jobseekerAllowanceContributionSource.amount,
      schedule: this.sampleData.jobseekerAllowanceContributionSource.schedule
    },
    hasIncomeSupportSource: this.sampleData.hasIncomeSupportSource,
    incomeSupportSource: {
      amount: this.sampleData.incomeSupportSource.amount,
      schedule: this.sampleData.incomeSupportSource.schedule
    },
    hasWorkingTaxCreditSource: this.sampleData.hasWorkingTaxCreditSource,
    workingTaxCreditSource: {
      amount: this.sampleData.workingTaxCreditSource.amount,
      schedule: this.sampleData.workingTaxCreditSource.schedule
    },
    hasChildTaxCreditSource: this.sampleData.hasChildTaxCreditSource,
    childTaxCreditSource: {
      amount: this.sampleData.childTaxCreditSource.amount,
      schedule: this.sampleData.childTaxCreditSource.schedule
    },
    hasChildBenefitSource: this.sampleData.hasChildBenefitSource,
    childBenefitSource: {
      amount: this.sampleData.childBenefitSource.amount,
      schedule: this.sampleData.childBenefitSource.schedule
    },
    hasCouncilTaxSupportSource: this.sampleData.hasCouncilTaxSupportSource,
    councilTaxSupportSource: {
      amount: this.sampleData.councilTaxSupportSource.amount,
      schedule: this.sampleData.councilTaxSupportSource.schedule
    },
    hasPensionSource: this.sampleData.hasPensionSource,
    pensionSource: {
      amount: this.sampleData.pensionSource.amount,
      schedule: this.sampleData.pensionSource.schedule
    }
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

describe.only('MonthlyIncome', () => {
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

  describe('normalize', () => {
    it('should return normalized MonthlyIncome with `hasSalarySource` true when `schedule` not provided', () => {
      const sampleMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {
          amount: 100
        }
      }).forConstructor()

      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: true,
        salarySource: {
          amount: 100
        }
      }).forConstructor()
      expect(sampleMonthtlyIncomeObject.normalize()).to.deep.equal(expectedMonthtlyIncomeObject)
    })

    it('should return normalized MonthlyIncome with `hasSalarySource` true when `amount` not provided', () => {
      const sampleMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()

      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: true,
        salarySource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()
      expect(sampleMonthtlyIncomeObject.normalize()).to.deep.equal(expectedMonthtlyIncomeObject)
    })

    it('should return normalized MonthlyIncome with `hasSalarySource` true when `amount` and `schedule` provided', () => {
      const sampleMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {
          amount: 100,
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()

      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: true,
        salarySource: {
          amount: 100,
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()
      expect(sampleMonthtlyIncomeObject.normalize()).to.deep.equal(expectedMonthtlyIncomeObject)
    })

    it('should return normalized MonthlyIncome with `hasSalarySource` false when `salary` source is not provided', () => {
      const sampleMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {}
      }).forConstructor()

      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {}
      }).forConstructor()
      expect(sampleMonthtlyIncomeObject.normalize()).to.deep.equal(expectedMonthtlyIncomeObject)
    })

    it('should return normalized MonthlyIncome with `hasSource` property to true for all incomes sources', () => {
      const sampleMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: false,
        salarySource: {
          amount: 100
        },
        hasUniversalCreditSource: false,
        universalCreditSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasJobseekerAllowanceIncomeSource: false,
        jobseekerAllowanceIncomeSource: {
          amount: 100
        },
        hasJobseekerAllowanceContributionSource: false,
        jobseekerAllowanceContributionSource: {
          amount: 100
        },
        hasIncomeSupportSource: false,
        incomeSupportSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasWorkingTaxCreditSource: false,
        workingTaxCreditSource: {
          amount: 100
        },
        hasChildTaxCreditSource: false,
        childTaxCreditSource: {
          amount: 100
        },
        hasChildBenefitSource: false,
        childBenefitSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasCouncilTaxSupportSource: false,
        councilTaxSupportSource: {
          amount: 100
        },
        hasPensionSource: false,
        pensionSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()

      const expectedMonthtlyIncomeObject = getSampleMonthtlyIncomeObject({
        hasSalarySource: true,
        salarySource: {
          amount: 100
        },
        hasUniversalCreditSource: true,
        universalCreditSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasJobseekerAllowanceIncomeSource: true,
        jobseekerAllowanceIncomeSource: {
          amount: 100
        },
        hasJobseekerAllowanceContributionSource: true,
        jobseekerAllowanceContributionSource: {
          amount: 100
        },
        hasIncomeSupportSource: true,
        incomeSupportSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasWorkingTaxCreditSource: true,
        workingTaxCreditSource: {
          amount: 100
        },
        hasChildTaxCreditSource: true,
        childTaxCreditSource: {
          amount: 100
        },
        hasChildBenefitSource: true,
        childBenefitSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        },
        hasCouncilTaxSupportSource: true,
        councilTaxSupportSource: {
          amount: 100
        },
        hasPensionSource: true,
        pensionSource: {
          schedule: IncomeExpenseSchedule.TWO_WEEKS
        }
      }).forConstructor()
      expect(sampleMonthtlyIncomeObject.normalize()).to.deep.equal(expectedMonthtlyIncomeObject)
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
