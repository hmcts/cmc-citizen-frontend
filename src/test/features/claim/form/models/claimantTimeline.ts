import { expect } from 'chai'

import { ClaimantTimeline, ValidationErrors } from 'claim/form/models/claimantTimeline'
import { Validator } from '@hmcts/class-validator'
import { TimelineRow } from 'forms/models/timelineRow'
import { INIT_ROW_COUNT } from 'forms/models/timeline'
import { expectValidationError } from 'test/app/forms/models/validationUtils'

describe('ClaimantTimeline', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of TimelineRow`, () => {

      const actual: TimelineRow[] = (new ClaimantTimeline()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = ClaimantTimeline.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return ClaimantTimeline with list of empty TimelineRow[] when empty input given', () => {
      const actual: ClaimantTimeline = ClaimantTimeline.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return ClaimantTimeline with first element on list populated', () => {
      const actual: ClaimantTimeline = ClaimantTimeline.fromObject({ rows: [{ date: 'May', description: 'OK' }] })

      const populatedItem: TimelineRow = actual.rows.pop()

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
    })

    it('should return object with list of TimelineRow longer than default', () => {
      const actual: ClaimantTimeline = ClaimantTimeline.fromObject(
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

  describe('validation', () => {

    const validator: Validator = new Validator()

    it('should reject when no rows given', () => {
      const errors = validator.validateSync(new ClaimantTimeline([]))

      expect(errors.length).to.equal(1)
      expectValidationError(errors, ValidationErrors.ENTER_AT_LEAST_ONE_ROW)
    })

    it('should accept when at least one row given', () => {
      const errors = validator.validateSync(new ClaimantTimeline([new TimelineRow('may', 'ok')]))

      expect(errors.length).to.equal(0)
    })
  })
})

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
