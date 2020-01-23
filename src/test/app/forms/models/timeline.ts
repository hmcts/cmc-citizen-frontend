import { expect } from 'chai'

import { INIT_ROW_COUNT, Timeline } from 'forms/models/timeline'
import { TimelineRow } from 'forms/models/timelineRow'
import { expectValidationError } from 'test/app/forms/models/validationUtils'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { MAX_NUMBER_OF_ROWS } from 'forms/models/multiRowForm'

describe('Timeline', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of TimelineRow`, () => {

      const actual: TimelineRow[] = (new Timeline()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = Timeline.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return Timeline with list of empty TimelineRow[] when empty input given', () => {
      const actual: Timeline = Timeline.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return Timeline with first element on list populated', () => {
      const actual: Timeline = Timeline.fromObject({ rows: [{ date: 'May', description: 'OK' }] })

      const populatedItem: TimelineRow = actual.rows.pop()

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of TimelineRow longer than default', () => {
      const actual: Timeline = Timeline.fromObject(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' },
            { date: 'Jun', description: 'OK' }
          ]
        }
      )

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('deserialize', () => {

    it('should return valid Timeline object with list of empty TimelineRow', () => {
      const actual: Timeline = new Timeline().deserialize({})

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return valid Timeline object with populated first TimelineRow', () => {
      const actual: Timeline = new Timeline().deserialize(
        { rows: [{ date: 'May', description: 'OK' }] }
      )

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      const populatedItem: TimelineRow = actual.rows[0]

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows.slice(1))
    })

    it('should return valid Timeline object with list of row longer than default length', () => {
      const actual: Timeline = new Timeline().deserialize(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' }
          ]
        }
      )

      expectAllRowsToBePopulated(actual.rows)
    })
  })

  describe('appendRow', () => {

    it('adds empty element to list of rows', () => {
      const actual: Timeline = new Timeline()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      actual.appendRow()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT + 1)
    })

    it(`adds only up to the maximum row count elements`, () => {
      const actual: Timeline = new Timeline()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

      for (let i = 0; i < actual.getMaxNumberOfRows() + 1; i++) {
        actual.appendRow()
      }

      expect(actual.rows.length).to.be.eq(actual.getMaxNumberOfRows())
    })
  })

  describe('removeExcessRows', () => {

    it('should filter out all elements from list when empty', () => {
      const actual: Timeline = new Timeline()

      expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(0)
    })

    it('should not filter out any element from list when all populated', () => {
      const actual: Timeline = new Timeline().deserialize({
        rows: [
          { date: 'Jan', description: 'OK' },
          { date: 'Feb', description: 'OK' },
          { date: 'Mar', description: 'OK' },
          { date: 'Apr', description: 'OK' },
          { date: 'May', description: 'OK' }
        ]
      })

      expect(actual.rows.length).to.be.eq(5)
      actual.removeExcessRows()
      expect(actual.rows.length).to.be.eq(5)
      expectAllRowsToBePopulated(actual.rows)
    })

    it('should filter out some elements from list when some of them are populated', () => {
      const actual: Timeline = new Timeline().deserialize({
        rows: [
          { date: 'Jan', description: 'OK' },
          { date: 'Feb', description: 'OK' },
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
      const actual: Timeline = new Timeline().deserialize({
        rows: [
          { date: 'Jan', description: 'OK' },
          {},
          { date: 'Feb', description: 'OK' },
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
      const actual: Timeline = new Timeline()

      expect(actual.canAddMoreRows()).to.be.eq(true)
    })

    it('should return true when number of rows is equal max', () => {
      const actual: Timeline = new Timeline()

      for (let i = 0; i < MAX_NUMBER_OF_ROWS; i++) {
        actual.appendRow()
      }

      expect(actual.canAddMoreRows()).to.be.eq(false)
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject only when an invalid row given', () => {
      const errors = validator.validateSync(new Timeline([row('', 'ok')]))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
    })

    context('should accept when', () => {
      it('no rows given', () => {
        const errors = validator.validateSync(new Timeline([]))

        expect(errors.length).to.equal(0)
      })

      it('valid rows rows given', () => {
        const errors = validator.validateSync(new Timeline([row('may', 'ok'), row('june', 'ok')]))

        expect(errors.length).to.equal(0)
      })
    })

  })
})

function row (date: string, description: string): TimelineRow {
  return new TimelineRow(date, description)
}

function expectAllRowsToBeEmpty (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(item).instanceof(TimelineRow)
    expect(item.isEmpty()).to.eq(true)
  })
}

function expectAllRowsToBePopulated (rows: TimelineRow[]) {
  rows.forEach(item => {
    expect(item.isEmpty()).to.eq(false)
  })
}
