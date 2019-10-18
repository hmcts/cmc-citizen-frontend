import { expect } from 'chai'
import { Debts, ValidationErrors, INIT_ROW_COUNT } from 'response/form/models/statement-of-means/debts'
import { DebtRow } from 'response/form/models/statement-of-means/debtRow'
import { Validator } from '@hmcts/class-validator'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('Debts', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of DebtRow`, () => {

      const actual: DebtRow[] = (new Debts()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('deserialize', () => {

    it('should return empty object', () => {
      const actual: Debts = new Debts().deserialize(undefined)

      expect(actual).to.be.instanceof(Debts)
      expect(actual.declared).to.be.eq(undefined)
      expect(actual.rows.length).to.eql(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Debts with list of empty DebtRow[] when declared = false', () => {
      const actual: Debts = new Debts().deserialize({ declared: false })

      expect(actual.rows.length).to.eql(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Debts with first element on list populated', () => {
      const actual: Debts = new Debts().deserialize({
        declared: true,
        rows: [
          { debt: 'credit card', totalOwed: 100, monthlyPayments: 10 }
        ]
      })

      const populatedItem: DebtRow = actual.rows[0]

      expect(populatedItem.debt).to.eq('credit card')
      expect(populatedItem.totalOwed).to.eq(100)
      expect(populatedItem.monthlyPayments).to.eq(10)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = Debts.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return Debts with list of empty DebtRow[] when declared = false', () => {
      const actual: Debts = Debts.fromObject({ declared: 'false' })

      expect(actual.rows.length).to.eql(0)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Debts with first element on list populated', () => {
      const actual: Debts = Debts.fromObject({
        declared: 'true',
        rows: [
          { debt: 'credit card', totalOwed: '100', monthlyPayments: '10' }
        ]
      })

      const populatedItem: DebtRow = actual.rows.pop()

      expect(populatedItem.debt).to.eq('credit card')
      expect(populatedItem.totalOwed).to.eq(100)
      expect(populatedItem.monthlyPayments).to.eq(10)

      expectAllRowsToBeEmpty(actual.rows)
    })
  })

  describe('createEmptyRow', () => {

    it('should create DebtRow object with empty fields', () => {
      const emptyItem: DebtRow = new Debts().createEmptyRow()

      expect(emptyItem.isEmpty()).to.be.eq(true)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should accept', () => {

      it('when declared = false', () => {
        const errors = validator.validateSync(new Debts(false, undefined))

        expect(errors.length).to.equal(0)
      })

      it('when declared = true and one valid row given', () => {
        const errors = validator.validateSync(new Debts(true, [new DebtRow('my card', 100, 10)]))

        expect(errors.length).to.equal(0)
      })

      it('when declared = true and many valid row given', () => {
        const o: DebtRow = new DebtRow('my card', 100, 10) // valid row
        const errors = validator.validateSync(new Debts(true, [o, o, o, o, o, o, o, o, o, o, o, o]))

        expect(errors.length).to.equal(0)
      })

      it('when declared = true and one valid row and many many empty ones given', () => {
        const o: DebtRow = DebtRow.empty()
        const errors = validator.validateSync(new Debts(true, [o, o, o, o, new DebtRow('card', 1, 1), o, o, o, o]))

        expect(errors.length).to.equal(0)
      })
    })

    context('should reject', () => {

      it('when declared = true and empty list of rows', () => {
        const errors = validator.validateSync(new Debts(true, []))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
      })

      it('when declared = true and invalid row given', () => {
        const errors = validator.validateSync(new Debts(true, [new DebtRow('', 100, 10)]))

        expect(errors.length).to.equal(1)
      })

      it('when declared = true and many invalid row given', () => {
        const o: DebtRow = new DebtRow('my card', -100, 10) // invalid row
        const errors = validator.validateSync(new Debts(true, [o, o, o, o, o, o, o, o, o, o, o, o]))

        expect(errors.length).to.equal(1)
      })

      it('when declared = true and many empty rows and one invalid given', () => {
        const o: DebtRow = DebtRow.empty()
        const errors = validator.validateSync(new Debts(true, [o, o, o, o, o, o, new DebtRow('my card', -100, 10), o]))

        expect(errors.length).to.equal(1)
      })
    })
  })
})

function expectAllRowsToBeEmpty (rows: DebtRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(DebtRow)
    expect(item.isEmpty()).to.eq(true)
  })
}
