import { expect } from 'chai'

import { TimelineRow } from 'forms/models/timelineRow'
import { Validator } from '@hmcts/class-validator'
import { ValidationErrors } from 'forms/validation/validationErrors'
import { expectValidationError, generateString } from 'test/app/forms/models/validationUtils'
import { DefendantTimeline } from 'response/form/models/defendantTimeline'
import { INIT_ROW_COUNT } from 'forms/models/timeline'
import { ValidationConstraints } from 'forms/validation/validationConstraints'

describe('DefendantTimeline', () => {

  describe('on init', () => {

    it(`should create array of ${INIT_ROW_COUNT} empty instances of TimelineRow`, () => {

      const actual: TimelineRow[] = (new DefendantTimeline()).rows

      expect(actual.length).to.equal(INIT_ROW_COUNT)
      expectAllRowsToBeEmpty(actual)
    })
  })

  describe('fromObject', () => {

    it('should return undefined value when undefined provided', () => {
      const actual: any = DefendantTimeline.fromObject(undefined)

      expect(actual).to.eql(undefined)
    })

    it('should return DefendantTimeline with list of empty TimelineRow[] when empty input given', () => {
      const actual: DefendantTimeline = DefendantTimeline.fromObject([])

      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.comment).to.be.eq(undefined)
    })

    it('should return DefendantTimeline with first element on list populated', () => {
      const actual: DefendantTimeline = DefendantTimeline.fromObject(
        { rows: [{ date: 'May', description: 'OK' }], comment: 'not ok' })

      const populatedItem: TimelineRow = actual.rows.pop()

      expect(populatedItem.date).to.eq('May')
      expect(populatedItem.description).to.eq('OK')

      expectAllRowsToBeEmpty(actual.rows)
      expect(actual.comment).to.be.eq('not ok')
    })

    it('should return object with list of TimelineRow longer than default', () => {
      const actual: DefendantTimeline = DefendantTimeline.fromObject(
        {
          rows: [
            { date: 'Jan', description: 'OK' },
            { date: 'Feb', description: 'OK' },
            { date: 'Mar', description: 'OK' },
            { date: 'Apr', description: 'OK' },
            { date: 'May', description: 'OK' },
            { date: 'Jun', description: 'OK' }
          ], comment: 'I do not agree'
        }
      )

      expect(actual.rows.length).to.be.greaterThan(INIT_ROW_COUNT)
      expectAllRowsToBePopulated(actual.rows)
      expect(actual.comment).to.be.eq('I do not agree')
    })
  })

  describe('deserialize', () => {

    context('should return valid DefendantTimeline object with list of', () => {

      [{}, undefined].forEach(input => {
        it(`empty TimelineRow when ${input} given`, () => {
          const actual: DefendantTimeline = new DefendantTimeline().deserialize(input)

          expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
          expectAllRowsToBeEmpty(actual.rows)
          expect(actual.comment).to.be.eq(undefined)
        })
      })

      it('should return valid DefendantTimeline object with list of empty TimelineRow', () => {
        const actual: DefendantTimeline = new DefendantTimeline().deserialize({})

        expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)
        expectAllRowsToBeEmpty(actual.rows)
        expect(actual.comment).to.be.eq(undefined)
      })

      it('should return valid DefendantTimeline object with populated first TimelineRow', () => {
        const actual: DefendantTimeline = new DefendantTimeline().deserialize(
          { rows: [{ date: 'May', description: 'OK' }], comment: 'fine' }
        )

        expect(actual.rows.length).to.be.eq(INIT_ROW_COUNT)

        const populatedItem: TimelineRow = actual.rows[0]

        expect(populatedItem.date).to.eq('May')
        expect(populatedItem.description).to.eq('OK')

        expectAllRowsToBeEmpty(actual.rows.slice(1))
        expect(actual.comment).to.be.eq('fine')
      })
    })
  })

  describe('validation', () => {

    const validator: Validator = new Validator()

    context('should reject when', () => {
      it('an invalid row given', () => {
        const errors = validator.validateSync(new DefendantTimeline([row('', 'ok')], ''))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.DATE_REQUIRED)
      })

      it('an invalid row given', () => {
        const errors = validator.validateSync(
          new DefendantTimeline(
            [row('ok', 'ok')], generateString(ValidationConstraints.FREE_TEXT_MAX_LENGTH + 1)
          )
        )

        expect(errors.length).to.equal(1)
        expectValidationError(errors, ValidationErrors.TEXT_TOO_LONG)
      })
    })

    context('should accept when', () => {
      it('no rows given, no comment', () => {
        const errors = validator.validateSync(new DefendantTimeline([]))

        expect(errors.length).to.equal(0)
      })

      it('valid rows rows given and valid comment', () => {
        const errors = validator.validateSync(
          new DefendantTimeline([row('may', 'ok'), row('june', 'ok')], 'comment')
        )

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
