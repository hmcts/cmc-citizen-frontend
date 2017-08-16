import { expect } from 'chai'
import { Validator } from 'class-validator'

import { expectValidationError } from './validationUtils'

import ClaimAmountBreakdown, { ValidationErrors as BreakdownValidationErrors } from 'forms/models/claimAmountBreakdown'
import ClaimAmountRow, { ValidationErrors } from 'forms/models/claimAmountRow'

describe('ClaimAmountBreakdown', () => {
  describe('initialRows', () => {
    it('should return 4 rows by default', () => {
      expect(ClaimAmountBreakdown.initialRows()).to.have.lengthOf(4)
    })

    it('should return initiated objects', () => {
      for (let row of ClaimAmountBreakdown.initialRows()) {
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
            amount: 100.01
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
    let rows

    beforeEach(() => {
      rows = [
        {
          reason: '',
          amount: undefined
        }
      ]
    })

    it('should append one row when called once', () => {
      let breakdown = new ClaimAmountBreakdown(rows)
      breakdown.appendRow()
      expect(breakdown.rows).to.have.lengthOf(2)
    })

    it('should append three row when called thrice', () => {
      let breakdown = new ClaimAmountBreakdown(rows)
      breakdown.appendRow()
      breakdown.appendRow()
      breakdown.appendRow()
      expect(breakdown.rows).to.have.lengthOf(4)
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
})
