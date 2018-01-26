import { expect } from 'chai'
import { MonthlyExpenses, INIT_ROW_COUNT } from 'response/form/models/statement-of-means/monthlyExpenses'
import { AmountDescriptionRow, ValidationErrors } from 'response/form/models/statement-of-means/amountDescriptionRow'
import { Validator } from 'class-validator'
import { expectValidationError, generateString } from '../../../../../app/forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('MonthlyExpenses', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty AmountDescriptionRows and all other fields are empty`, () => {

      const actual: MonthlyExpenses = new MonthlyExpenses()

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = MonthlyExpenses.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return MonthlyExpenses with list of empty AmountDescriptionRow[] when empty input given', () => {
      const actual: MonthlyExpenses = MonthlyExpenses.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return MonthlyExpenses with first element on list populated', () => {
      const actual: MonthlyExpenses = MonthlyExpenses.fromObject(prepareInput())

      expect(actual.mortgage).to.be.eq(1)
      expect(actual.rent).to.be.eq(2)
      expect(actual.councilTax).to.be.eq(3)
      expect(actual.gas).to.be.eq(4)
      expect(actual.electricity).to.be.eq(5)
      expect(actual.water).to.be.eq(6)
      expect(actual.travel).to.be.eq(7)
      expect(actual.schoolCosts).to.be.eq(8)
      expect(actual.foodAndHousekeeping).to.be.eq(9)
      expect(actual.tvAndBroadband).to.be.eq(10)
      expect(actual.mobilePhone).to.be.eq(11)
      expect(actual.maintenance).to.be.eq(12)

      const populatedItem: AmountDescriptionRow = actual.rows.pop()

      expect(populatedItem.amount).to.eq(13)
      expect(populatedItem.description).to.eq('bla')

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return empty object when undefined provided', () => {
      const actual: MonthlyExpenses = new MonthlyExpenses().deserialize(undefined)

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })

    it('should return MonthlyExpenses with list of empty AmountDescriptionRow[] when empty input given', () => {
      const actual: MonthlyExpenses = new MonthlyExpenses().deserialize({ rows: [] })

      expectAllFieldsToBeEmpty(actual)
      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.rows.length).to.equal(INIT_ROW_COUNT)
    })

    it('should return MonthlyExpenses with all fiedls populated and one row', () => {
      const actual: MonthlyExpenses = new MonthlyExpenses().deserialize({
        mortgage: 1,
        rent: 2,
        councilTax: 3,
        gas: 4,
        electricity: 5,
        water: 6,
        travel: 7,
        schoolCosts: 8,
        foodAndHousekeeping: 9,
        tvAndBroadband: 10,
        mobilePhone: 11,
        maintenance: 12,
        rows: [{ amount: 13, description: 'bla bla' }]
      })

      expect(actual.mortgage).to.be.eq(1)
      expect(actual.rent).to.be.eq(2)
      expect(actual.councilTax).to.be.eq(3)
      expect(actual.gas).to.be.eq(4)
      expect(actual.electricity).to.be.eq(5)
      expect(actual.water).to.be.eq(6)
      expect(actual.travel).to.be.eq(7)
      expect(actual.schoolCosts).to.be.eq(8)
      expect(actual.foodAndHousekeeping).to.be.eq(9)
      expect(actual.tvAndBroadband).to.be.eq(10)
      expect(actual.mobilePhone).to.be.eq(11)
      expect(actual.maintenance).to.be.eq(12)

      const populatedItem: AmountDescriptionRow = actual.rows.pop()

      expect(populatedItem.amount).to.eq(13)
      expect(populatedItem.description).to.eq('bla bla')

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept when', () => {

      it('all mandatory fields populated and valid input given for rows', () => {
        const errors = validator.validateSync(MonthlyExpenses.fromObject(prepareInput()))

        expect(errors.length).to.equal(0)
      })

      it('all mandatory fields populated and empty rows', () => {
        const errors = validator.validateSync(MonthlyExpenses.fromObject(prepareInput({ rows: [] })))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject when', () => {

      it('all fields empty', () => {
        const errors = validator.validateSync(new MonthlyExpenses())

        expect(errors.length).to.equal(12)
        expectValidationError(errors, GlobalValidationErrors.AMOUNT_REQUIRED + ' for Mortgage (Include all mortgages)')
      })

      it('all fields negative', () => {
        const errors = validator.validateSync(new MonthlyExpenses(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, []))

        expect(errors.length).to.equal(12)
        expectValidationError(errors, GlobalValidationErrors.NON_NEGATIVE_NUMBER_REQUIRED + ' for Mortgage (Include all mortgages)')
      })

      context('all mandatory fields valid and invalid input for populated row', () => {

        it('description not populated', () => {
          const errors = validator.validateSync(
            MonthlyExpenses.fromObject(prepareInput({ rows: [{ amount: '12', description: '' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, ValidationErrors.DESCRIPTION_REQUIRED)
        })

        it('description too long', () => {
          const errors = validator.validateSync(
            MonthlyExpenses.fromObject(prepareInput({
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
            MonthlyExpenses.fromObject(prepareInput({ rows: [{ amount: '', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.AMOUNT_REQUIRED)
        })

        it('amount less than zero', () => {
          const errors = validator.validateSync(
            MonthlyExpenses.fromObject(prepareInput({ rows: [{ amount: '-10', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
        })

        it('amount = 0', () => {
          const errors = validator.validateSync(
            MonthlyExpenses.fromObject(prepareInput({ rows: [{ amount: '0', description: 'ble ble' }] }))
          )

          expect(errors.length).to.equal(1)
          expectValidationError(errors, GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
        })

        it('invalid format of amount', () => {
          const errors = validator.validateSync(
            MonthlyExpenses.fromObject(prepareInput({ rows: [{ amount: '12.1122', description: 'ble ble' }] }))
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
    mortgage: '1',
    rent: '2',
    councilTax: '3',
    gas: '4',
    electricity: '5',
    water: '6',
    travel: '7',
    schoolCosts: '8',
    foodAndHousekeeping: '9',
    tvAndBroadband: '10',
    mobilePhone: '11',
    maintenance: '12',
    rows: [{ amount: '13', description: 'bla' }],
    ...customData
  }
}

function expectAllRowsToBeEmpty (rows: AmountDescriptionRow[]): void {
  rows.forEach(item => {
    expect(item).instanceof(AmountDescriptionRow)
    expect(item.isEmpty()).to.eq(true)
  })
}

function expectAllFieldsToBeEmpty (actual: MonthlyExpenses): void {
  expect(actual.mortgage).to.be.eq(undefined)
  expect(actual.rent).to.be.eq(undefined)
  expect(actual.councilTax).to.be.eq(undefined)
  expect(actual.gas).to.be.eq(undefined)
  expect(actual.electricity).to.be.eq(undefined)
  expect(actual.water).to.be.eq(undefined)
  expect(actual.travel).to.be.eq(undefined)
  expect(actual.schoolCosts).to.be.eq(undefined)
  expect(actual.foodAndHousekeeping).to.be.eq(undefined)
  expect(actual.tvAndBroadband).to.be.eq(undefined)
  expect(actual.mobilePhone).to.be.eq(undefined)
  expect(actual.maintenance).to.be.eq(undefined)
}
