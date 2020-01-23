import { expect } from 'chai'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

import {
  ClaimAmountBreakdown,
  INIT_ROW_COUNT,
  MAX_NUMBER_OF_ROWS,
  ValidationErrors as BreakdownValidationErrors
} from 'claim/form/models/claimAmountBreakdown'
import { ClaimAmountRow, ValidationErrors } from 'claim/form/models/claimAmountRow'

describe('ClaimAmountBreakdown', () => {

  describe('on init', () => {

    it('should return 4 rows by default', () => {
      expect(new ClaimAmountBreakdown().rows).to.have.lengthOf(4)
    })

    it('should return initiated objects', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()
      for (let row of actual.rows) {
        expect(row).to.eql(new ClaimAmountRow(undefined, undefined))
      }
    })
  })

  describe('form object deserialization', () => {

    it('should return undefined when value is undefined', () => {
      expect(ClaimAmountBreakdown.fromObject(undefined)).to.be.equal(undefined)
    })

    it('should return null when value is null', () => {
      expect(ClaimAmountBreakdown.fromObject(null)).to.be.equal(null)
    })

    it('should leave missing fields undefined', () => {
      expect(ClaimAmountBreakdown.fromObject({})).to.deep.equal(new ClaimAmountBreakdown([]))
    })

    it('should deserialize all fields', () => {

      expect(ClaimAmountBreakdown.fromObject({
        rows: [
          {
            reason: 'Something',
            amount: '100.01'
          }
        ]
      })).to.deep.equal(new ClaimAmountBreakdown([new ClaimAmountRow('Something', 100.01)]))
    })
  })

  describe('deserialize', () => {

    it('should return a ClaimAmountBreakdown instance', () => {
      let deserialized = new ClaimAmountBreakdown().deserialize({})
      expect(deserialized).to.be.instanceof(ClaimAmountBreakdown)
    })

    it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given "undefined"', () => {
      let deserialized = new ClaimAmountBreakdown().deserialize(undefined)
      expect(deserialized.rows).to.have.lengthOf(4)
    })

    it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given "null"', () => {
      let deserialized = new ClaimAmountBreakdown().deserialize(null)
      expect(deserialized.rows).to.have.lengthOf(4)
    })

    it('should return a ClaimAmountBreakdown instance with "rows" is initialised with 4 ClaimAmountRow when given an empty object', () => {
      let deserialized = new ClaimAmountBreakdown().deserialize({})
      expect(deserialized.rows).to.have.lengthOf(4)
    })

    it('should return a ClaimAmountBreakdown instance with "rows" of length 4 with first populated when given an object of ClaimAmountRow', () => {
      let deserialized = new ClaimAmountBreakdown().deserialize({ rows: [{ reason: 'reason', amount: 200 }] })
      expect(deserialized.rows).to.have.lengthOf(4)
      expect(deserialized.rows[0]).to.deep.eq(new ClaimAmountRow('reason', 200))
      expect(deserialized.rows[1]).to.deep.eq(new ClaimAmountRow(undefined, undefined))
      expect(deserialized.rows[2]).to.deep.eq(new ClaimAmountRow(undefined, undefined))
      expect(deserialized.rows[3]).to.deep.eq(new ClaimAmountRow(undefined, undefined))

    })

    it('should return a ClaimAmountBreakdown instance with "rows" of length 4 when given 4 objects of ClaimAmountRow', () => {
      const input = {
        rows: [
          { reason: 'reason', amount: 200 },
          { reason: 'reason', amount: 101.23 },
          { reason: 'reason', amount: 34.21 },
          { reason: 'reason', amount: 3000 }
        ]
      }

      let deserialized = new ClaimAmountBreakdown().deserialize(input)
      expect(deserialized.rows).to.have.lengthOf(4)
      expect(deserialized.rows[0]).to.deep.eq(new ClaimAmountRow('reason', 200))
      expect(deserialized.rows[1]).to.deep.eq(new ClaimAmountRow('reason', 101.23))
      expect(deserialized.rows[2]).to.deep.eq(new ClaimAmountRow('reason', 34.21))
      expect(deserialized.rows[3]).to.deep.eq(new ClaimAmountRow('reason', 3000))
    })
  })

  describe('appendRow', () => {

    it('should add empty element to list of rows', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })

    it('should append three row when called thrice', () => {
      let breakdown = new ClaimAmountBreakdown([])
      breakdown.appendRow()
      breakdown.appendRow()
      breakdown.appendRow()
      expect(breakdown.rows).to.have.lengthOf(3)
    })

    it('should add only up to 20 elements', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      for (let i = 0; i < MAX_NUMBER_OF_ROWS + 1; i++) {
        actual.appendRow()
      }

      expect(actual.rows.length).to.be.eq(MAX_NUMBER_OF_ROWS)
    })
  })

  describe('removeExcessRows', () => {

    it('should filter out all elements from list when empty', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(1)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should not filter out any element from list when all populated', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown().deserialize({
        rows: [
          { amount: 1, reason: 'OK' },
          { amount: 2, reason: 'OK' },
          { amount: 3.1, reason: 'OK' },
          { amount: 12.54, reason: 'OK' },
          { amount: 10, reason: 'OK' }
        ]
      })

      expect(actual.rows.length).to.be.eq(5)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(5)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when some of them are populated', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown().deserialize({
        rows: [
          { amount: 11, reason: 'OK' },
          { amount: 21, reason: 'OK' },
          {},
          {}
        ]
      })

      expect(actual.rows.length).to.be.eq(4)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(2)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when mixed', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown().deserialize({
        rows: [
          { amount: 1, reason: 'OK' },
          {},
          { amount: 2, reason: 'OK' },
          {}
        ]
      })

      expect(actual.rows.length).to.be.eq(4)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(2)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject breakdown if at least one row is invalid', () => {
      const errors = validator.validateSync(new ClaimAmountBreakdown([new ClaimAmountRow(undefined, undefined), new ClaimAmountRow('Something', undefined)]))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.AMOUNT_REQUIRED)
    })

    it('should reject breakdown with empty rows', () => {
      const errors = validator.validateSync(new ClaimAmountBreakdown([new ClaimAmountRow(undefined, undefined)]))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, BreakdownValidationErrors.AMOUNT_REQUIRED)
    })
  })

  describe('totalAmount', () => {

    it('should return 0 if there are no rows', () => {
      let breakdown = new ClaimAmountBreakdown([])
      expect(breakdown.totalAmount()).to.equal(0)
    })

    it('should return the sum of row amounts', () => {
      let rows: ClaimAmountRow[] = []
      rows.push(new ClaimAmountRow('', 1.34))
      rows.push(new ClaimAmountRow('', 7.83))
      rows.push(new ClaimAmountRow('', 2.33))

      let breakdown = new ClaimAmountBreakdown(rows)
      expect(breakdown.totalAmount()).to.equal(11.5)
    })

    it('should return the sum of row amounts excluding negatives', () => {
      let rows: ClaimAmountRow[] = []
      rows.push(new ClaimAmountRow('', 1.34))
      rows.push(new ClaimAmountRow('', 7.83))
      rows.push(new ClaimAmountRow('', 2.33))
      rows.push(new ClaimAmountRow('', -2.33))

      let breakdown = new ClaimAmountBreakdown(rows)
      expect(breakdown.totalAmount()).to.equal(11.5)
    })

    it('should raise an error for null values', () => {
      let breakdown = new ClaimAmountBreakdown([
        new ClaimAmountRow('', null)
      ])
      expect(breakdown.totalAmount).to.throw(Error)
    })

    it('should raise an error for undefined values', () => {
      let breakdown = new ClaimAmountBreakdown([
        new ClaimAmountRow('', undefined)
      ])
      expect(breakdown.totalAmount).to.throw(Error)
    })
  })

  describe('canAddMoreRows', () => {

    it('should return true when number of elements is lower than max number', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()

      expect(actual.canAddMoreRows()).to.be.eq(true)
    })

    it('should return true when number of rows is equal max', () => {
      const actual: ClaimAmountBreakdown = new ClaimAmountBreakdown()

      for (let i = 0; i < MAX_NUMBER_OF_ROWS; i++) {
        actual.appendRow()
      }

      expect(actual.canAddMoreRows()).to.be.eq(false)
    })
  })
})

function expectAllRowsToBeEmpty (rows: ClaimAmountRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(ClaimAmountRow)
    expect(item.amount).to.eq(undefined)
    expect(item.reason).to.eq(undefined)
  })
}

function expectAllRowsToBePopulated (rows: ClaimAmountRow[]) {
  rows.forEach(item => {
    expect(!!item.amount).to.eq(true)
    expect(!!item.reason).to.eq(true)
  })
}
