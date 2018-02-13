import { expect } from 'chai'
import { CourtOrders, ValidationErrors } from 'response/form/models/statement-of-means/courtOrders'
import { CourtOrderRow } from 'response/form/models/statement-of-means/courtOrderRow'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../../../../app/forms/models/validationUtils'
import { INIT_ROW_COUNT } from 'forms/models/multiRowForm'

describe('CourtOrders', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of CourtOrderRow`, () => {

      const actual: CourtOrderRow[] = (new CourtOrders()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('deserialize', () => {

    it('should return empty object', () => {
      const actual: CourtOrders = new CourtOrders().deserialize(undefined)

      expect(actual).to.be.instanceof(CourtOrders)
      expect(actual.hasAnyCourtOrders).to.be.eq(undefined)
      expect(actual.rows.length).to.eql(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return CourtOrders with list of empty CourtOrderRow[] when hasAnyCourtOrders = false', () => {
      const actual: CourtOrders = new CourtOrders().deserialize({ hasAnyCourtOrders: false })

      expect(actual.rows.length).to.eql(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return CourtOrders with first element on list populated', () => {
      const actual: CourtOrders = new CourtOrders().deserialize({
        hasAnyCourtOrders: true,
        rows: [{ details: 'abc', amount: 100 }]
      })

      const populatedItem: CourtOrderRow = actual.rows.pop()

      expect(populatedItem.details).to.eq('abc')
      expect(populatedItem.amount).to.eq(100)

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = CourtOrders.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return CourtOrders with list of empty CourtOrderRow[] when hasAnyCourtOrders = false', () => {
      const actual: CourtOrders = CourtOrders.fromObject({ hasAnyCourtOrders: 'false' })

      expect(actual.rows.length).to.eql(0)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return CourtOrders with first element on list populated', () => {
      const actual: CourtOrders = CourtOrders.fromObject({
        hasAnyCourtOrders: 'true',
        rows: [{ details: 'abc', amount: 100 }]
      })

      const populatedItem: CourtOrderRow = actual.rows.pop()

      expect(populatedItem.details).to.eq('abc')
      expect(populatedItem.amount).to.eq(100)

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('createEmptyRow', () => {

    it('should create CourtOrderRow object with empty fields', () => {
      const emptyItem: CourtOrderRow = new CourtOrders().createEmptyRow()

      expect(emptyItem.isEmpty()).to.be.eq(true)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when hasAnyCourtOrders = false', () => {
        const errors = validator.validateSync(new CourtOrders(false, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when hasAnyCourtOrders = true and one valid row given', () => {
        const errors = validator.validateSync(new CourtOrders(true, [new CourtOrderRow('abc', 100)]))

        expect(errors.length).to.equal(0)
      })

      it('when hasAnyCourtOrders = true and many valid row given', () => {
        const o: CourtOrderRow = new CourtOrderRow('abc', 100) // valid row
        const errors = validator.validateSync(new CourtOrders(true, [o, o, o, o, o, o, o, o, o, o, o, o]))

        expect(errors.length).to.equal(0)
      })

      it('when hasAnyCourtOrders = true and one valid row and many many empty ones given', () => {
        const o: CourtOrderRow = CourtOrderRow.empty()
        const errors = validator.validateSync(new CourtOrders(true, [o, o, new CourtOrderRow('abc', 1), o, o, o, o]))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when hasAnyCourtOrders = true and empty list of rows', () => {
        const errors = validator.validateSync(new CourtOrders(true, []))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
      })

      it('when hasAnyCourtOrders = true and invalid row given', () => {
        const errors = validator.validateSync(new CourtOrders(true, [new CourtOrderRow('', 100)]))

        expect(errors.length).to.equal(1)
      })

      it('when hasAnyCourtOrders = true and many invalid row given', () => {
        const o: CourtOrderRow = new CourtOrderRow('abc', -100) // invalid row
        const errors = validator.validateSync(new CourtOrders(true, [o, o, o, o, o, o, o, o, o, o, o, o]))

        expect(errors.length).to.equal(1)
      })

      it('when hasAnyCourtOrders = true and many empty rows and one invalid given', () => {
        const o: CourtOrderRow = CourtOrderRow.empty()
        const errors = validator.validateSync(new CourtOrders(true, [o, o, o, o, o, new CourtOrderRow('abc', -100), o]))

        expect(errors.length).to.equal(1)
      })
    })
  })
})

function expectAllRowsToBeEmpty (rows: CourtOrderRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(CourtOrderRow)
    expect(item.isEmpty()).to.eq(true)
  })
}
