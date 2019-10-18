import { expect } from 'chai'
import { Employers, ValidationErrors } from 'response/form/models/statement-of-means/employers'
import {
  EmployerRow,
  ValidationErrors as RowValidationErrors
} from 'response/form/models/statement-of-means/employerRow'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Validator } from '@hmcts/class-validator'

describe('Employers', () => {

  describe('on init', () => {

    it('should create array of 1 empty instances of EmployerRow', () => {

      const actual: EmployerRow[] = (new Employers()).rows

      expect(actual.length).to.equal(1)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = Employers.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return Employers with list of empty EmployerRow[] when empty input given', () => {
      const actual: Employers = Employers.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Employers with first element on list populated', () => {
      const actual: Employers = Employers.fromObject({ rows: [{ employerName: 'Comp', jobTitle: 'dev' }] })

      const populatedItem: EmployerRow = actual.rows.pop()

      expect(populatedItem.employerName).to.eq('Comp')
      expect(populatedItem.jobTitle).to.eq('dev')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of EmployerRow longer than default', () => {
      const actual: Employers = Employers.fromObject(
        {
          rows: [
            { employerName: 'Comp1', jobTitle: 'dev' },
            { employerName: 'Comp2', jobTitle: 'BA' },
            { employerName: 'Comp3', jobTitle: 'PM' },
            { employerName: 'Comp4', jobTitle: 'dev' },
            { employerName: 'Comp5', jobTitle: 'UX' },
            { employerName: 'Comp6', jobTitle: 'dev' }
          ]
        }
      )

      expect(actual.rows.length).to.be.greaterThan(actual.getInitialNumberOfRows())
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid Employers object with list of empty EmployerRow', () => {
      const actual: Employers = new Employers().deserialize({})

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows())
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid Employers object with populated first EmployerRow', () => {
      const actual: Employers = new Employers().deserialize(
        { rows: [{ employerName: 'Comp', jobTitle: 'dev' }] }
      )

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows())

      const populatedItem: EmployerRow = actual.rows[0]

      expect(populatedItem.employerName).to.eq('Comp')
      expect(populatedItem.jobTitle).to.eq('dev')

      expectAllRowsToBeEmpty(actual.rows.slice(1))
    })

    it('should return valid Employers object with list of row longer than default length', () => {
      const actual: Employers = new Employers().deserialize(
        {
          rows: [
            { employerName: 'Comp1', jobTitle: 'dev' },
            { employerName: 'Comp2', jobTitle: 'dev' },
            { employerName: 'Comp3', jobTitle: 'dev' },
            { employerName: 'Comp4', jobTitle: 'dev' },
            { employerName: 'Comp5', jobTitle: 'dev' }
          ]
        }
      )

      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('appendRow', () => {

    it('adds empty element to list of rows', () => {
      const actual: Employers = new Employers()

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows())

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows() + 1)
    })

    it('adds only up to 20 elements', () => {
      const actual: Employers = new Employers()

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows())

      for (let i = 0; i < actual.getMaxNumberOfRows() + 1; i++) {
        actual.appendRow()
      }

      expect(actual.rows.length).to.be.eq(actual.getMaxNumberOfRows())
    })
  })

  describe('removeExcessRows', () => {

    it('should filter out all elements from list when empty', () => {
      const actual: Employers = new Employers()

      expect(actual.rows.length).to.be.eq(actual.getInitialNumberOfRows())
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(0)
    })

    it('should not filter out any element from list when all populated', () => {
      const actual: Employers = new Employers().deserialize({
        rows: [
          { employerName: 'Comp1', jobTitle: 'BA' },
          { employerName: 'Comp2', jobTitle: 'UX' },
          { employerName: 'Comp3', jobTitle: 'dev' },
          { employerName: 'Comp4', jobTitle: 'PM' },
          { employerName: 'Comp5', jobTitle: 'janitor' }
        ]
      })

      expect(actual.rows.length).to.be.eq(5)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(5)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when some of them are populated', () => {
      const actual: Employers = new Employers().deserialize({
        rows: [
          { employerName: 'Comp1', jobTitle: 'BA' },
          { employerName: 'Comp2', jobTitle: 'UX' },
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
      const actual: Employers = new Employers().deserialize({
        rows: [
          { employerName: 'Comp1', jobTitle: 'BA' },
          {},
          { employerName: 'Comp2', jobTitle: 'UX' },
          {}
        ]
      })

      expect(actual.rows.length).to.be.eq(4)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(2)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('canAddMoreRows', () => {

    it('should return true when number of elements is lower than max number', () => {
      const actual: Employers = new Employers()

      expect(actual.canAddMoreRows()).to.be.eq(true)
    })

    it('should return true when number of rows is equal max', () => {
      const actual: Employers = new Employers()

      for (let i = 0; i < actual.getMaxNumberOfRows(); i++) {
        actual.appendRow()
      }

      expect(actual.canAddMoreRows()).to.be.eq(false)
    })
  })

  describe('validate', () => {

    const validator: Validator = new Validator()

    context('should reject when ', () => {

      it('0 rows given', () => {
        const errors = validator.validateSync(new Employers([]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
      })

      it('more than 0 empty rows given', () => {
        const errors = validator.validateSync(new Employers([EmployerRow.empty(), EmployerRow.empty()]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
      })

      it('more than 0 invalid rows given', () => {
        const errors = validator.validateSync(new Employers([new EmployerRow('company', undefined)]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, RowValidationErrors.JOB_TITLE_REQUIRED)
      })
    })

    context('should accept when', () => {

      it('at least one valid row given', () => {
        const errors = validator.validateSync(new Employers([new EmployerRow('company', 'dev')]))

        expect(errors.length).to.equal(0)
      })
    })
  })
})

function expectAllRowsToBeEmpty (rows: EmployerRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(EmployerRow)
    expect(item.jobTitle).to.eq(undefined)
    expect(item.employerName).to.eq(undefined)
  })
}

function expectAllRowsToBePopulated (rows: EmployerRow[]) {
  rows.forEach(item => {
    expect(!!item.jobTitle).to.eq(true)
    expect(!!item.employerName).to.eq(true)
  })
}
