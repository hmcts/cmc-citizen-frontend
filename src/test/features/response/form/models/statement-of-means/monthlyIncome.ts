import { expect } from 'chai'
import { MonthlyIncome, INIT_ROW_COUNT } from 'response/form/models/statement-of-means/monthlyIncome'
import { AmountDescriptionRow, ValidationErrors } from 'response/form/models/statement-of-means/amountDescriptionRow'
import { Validator } from 'class-validator'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('MonthlyIncome', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty AmountDescriptionRows and all other fields are empty`, () => {

      const actual: MonthlyIncome = new MonthlyIncome()

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = MonthlyIncome.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return MonthlyIncome with list of empty AmountDescriptionRow[] when empty input given', () => {
      const actual: MonthlyIncome = MonthlyIncome.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return MonthlyIncome with first element on list populated', () => {
      const actual: MonthlyIncome = MonthlyIncome.fromObject(prepareInput())

      expect(actual.salary).to.be.eq(1)
      expect(actual.universalCredit).to.be.eq(2)
      expect(actual.jobSeekerAllowanceIncome).to.be.eq(3)
      expect(actual.jobSeekerAllowanceContribution).to.be.eq(4)
      expect(actual.incomeSupport).to.be.eq(5)
      expect(actual.workingTaxCredit).to.be.eq(6)
      expect(actual.childTaxCredit).to.be.eq(7)
      expect(actual.childBenefit).to.be.eq(8)
      expect(actual.councilTaxSupport).to.be.eq(9)
      expect(actual.pension).to.be.eq(10)
      expect(actual.maintenance).to.be.eq(11)

      const populatedItem: AmountDescriptionRow = actual.rows.pop()

      expect(populatedItem.amount).to.eq(12)
      expect(populatedItem.description).to.eq('bla')

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return empty object when undefined provided', () => {
      const actual: MonthlyIncome = new MonthlyIncome().deserialize(undefined)

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })

    it('should return MonthlyIncome with list of empty AmountDescriptionRow[] when empty input given', () => {
      const actual: MonthlyIncome = new MonthlyIncome().deserialize({ rows: [] })

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })

    it('should return MonthlyIncome with all fiedls populated and one row', () => {
      const actual: MonthlyIncome = new MonthlyIncome().deserialize({
        salary: 1,
        universalCredit: 2,
        jobSeekerAllowanceIncome: 3,
        jobSeekerAllowanceContribution: 4,
        incomeSupport: 5,
        workingTaxCredit: 6,
        childTaxCredit: 7,
        childBenefit: 8,
        councilTaxSupport: 9,
        pension: 10,
        maintenance: 11,
        rows: [{ amount: 12, description: 'bla bla' }]
      })

      expect(actual.salary).to.be.eq(1)
      expect(actual.universalCredit).to.be.eq(2)
      expect(actual.jobSeekerAllowanceIncome).to.be.eq(3)
      expect(actual.jobSeekerAllowanceContribution).to.be.eq(4)
      expect(actual.incomeSupport).to.be.eq(5)
      expect(actual.workingTaxCredit).to.be.eq(6)
      expect(actual.childTaxCredit).to.be.eq(7)
      expect(actual.childBenefit).to.be.eq(8)
      expect(actual.councilTaxSupport).to.be.eq(9)
      expect(actual.pension).to.be.eq(10)
      expect(actual.maintenance).to.be.eq(11)

      const populatedItem: AmountDescriptionRow = actual.rows.pop()

      expect(populatedItem.amount).to.eq(12)
      expect(populatedItem.description).to.eq('bla bla')

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept when', () => {

      it('all mandatory fields populated and valid input given for rows', () => {
        const errors = validator.validateSync(MonthlyIncome.fromObject(prepareInput()))

        expect(errors.length).to.equal(0)
      })

      it('all mandatory fields populated and empty rows', () => {
        const errors = validator.validateSync(MonthlyIncome.fromObject(prepareInput({ rows: [] })))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject when', () => {

      it('all fields empty', () => {
        const errors = validator.validateSync(new MonthlyIncome())

        expect(errors.length).to.equal(11)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_REQUIRED)
      })

      it('all fields negative', () => {
        const errors = validator.validateSync(new MonthlyIncome(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, []))

        expect(errors.length).to.equal(11)
        expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED)
      })

      context('all mandatory fields valid and invalid input for populated row', () => {

        it('description not populated', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({ rows: [{ amount: '12', description: '' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
        })

        it('description too long', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({
              rows: [{
                amount: '12',
                description: generateString(ValidationConstraints.STANDARD_TEXT_INPUT_MAX_LENGTH + 1)
              }]
            }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.TEXT_TOO_LONG)
        })

        it('amount not populated', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({ rows: [{ amount: '', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.AMOUNT_REQUIRED)
        })

        it('amount less than zero', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({ rows: [{ amount: '-10', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
        })

        it('amount = 0', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({ rows: [{ amount: '0', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
        })

        it('invalid format of amount', () => {
          const errors = validator.validateSync(
            MonthlyIncome.fromObject(prepareInput({ rows: [{ amount: '12.1122', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.AMOUNT_INVALID_DECIMALS)
        })
      })
    })
  })
})

function prepareInput (customData?: object): object {
  return {
    salary: '1',
    universalCredit: '2',
    jobSeekerAllowanceIncome: '3',
    jobSeekerAllowanceContribution: '4',
    incomeSupport: '5',
    workingTaxCredit: '6',
    childTaxCredit: '7',
    childBenefit: '8',
    councilTaxSupport: '9',
    pension: '10',
    maintenance: '11',
    rows: [{ amount: '12', description: 'bla' }],
    ...customData
  }
}

function expectAllRowsToBeEmpty (rows: AmountDescriptionRow[]): void {
  rows.forEach(item => {
    expect(item).instanceof(AmountDescriptionRow)
    expect(item.isEmpty()).to.eq(true)
  })
}

function expectAllFieldsToBeEmpty (actual: MonthlyIncome): void {
  expect(actual.salary).to.be.eq(undefined)
  expect(actual.universalCredit).to.be.eq(undefined)
  expect(actual.jobSeekerAllowanceIncome).to.be.eq(undefined)
  expect(actual.jobSeekerAllowanceContribution).to.be.eq(undefined)
  expect(actual.incomeSupport).to.be.eq(undefined)
  expect(actual.workingTaxCredit).to.be.eq(undefined)
  expect(actual.childTaxCredit).to.be.eq(undefined)
  expect(actual.childBenefit).to.be.eq(undefined)
  expect(actual.councilTaxSupport).to.be.eq(undefined)
  expect(actual.pension).to.be.eq(undefined)
  expect(actual.maintenance).to.be.eq(undefined)
}
