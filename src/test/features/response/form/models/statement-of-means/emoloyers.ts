import { expect } from 'chai'
import { Employers, INIT_ROW_COUNT, MAX_NUMBER_OF_JOBS } from 'response/form/models/statement-of-means/employers'
import { EmployerRow } from 'response/form/models/statement-of-means/employerRow'

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

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid Employers object with list of empty EmployerRow', () => {
      const actual: Employers = new Employers().deserialize({})

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid Employers object with populated first EmployerRow', () => {
      const actual: Employers = new Employers().deserialize(
        { rows: [{ employerName: 'Comp', jobTitle: 'dev' }] }
      )

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

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

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })

    it('adds only up to 20 elements', () => {
      const actual: Employers = new Employers()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      for (let i = 0; i < MAX_NUMBER_OF_JOBS + 1; i++) {
        actual.appendRow()
      }

      expect(actual.rows.length).to.be.eq(MAX_NUMBER_OF_JOBS)
    })
  })

  describe('removeExcessRows', () => {

    it('should filter out all elements from list when empty', () => {
      const actual: Employers = new Employers()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(1)
      expectAllRowsToBeEmpty(actual.rows)
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

      for (let i = 0; i < MAX_NUMBER_OF_JOBS; i++) {
        actual.appendRow()
      }

      expect(actual.canAddMoreRows()).to.be.eq(false)
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
