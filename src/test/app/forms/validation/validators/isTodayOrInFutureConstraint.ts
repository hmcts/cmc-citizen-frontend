import { expect } from 'chai'
import * as moment from 'moment'

import { DateTodayOrInFutureConstraint } from 'forms/validation/validators/isTodayOrInFuture'

import { LocalDate } from 'forms/models/localDate'

describe('DateTodayOrInFutureConstraint', () => {
  const constraint: DateTodayOrInFutureConstraint = new DateTodayOrInFutureConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('given a date is undefined', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given a valid date in the future', () => {
        const inFuture = moment().add(10, 'years')
        expect(constraint.validate(new LocalDate(inFuture.year(), 1, 1))).to.equal(true)
      })

      it('given today date', () => {
        const now = moment()
        expect(constraint.validate(new LocalDate(now.year(), now.month() + 1, now.date()))).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given an invalid structure', () => {
        expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false)
      })

      it('given a date in the past', () => {
        const inPast = moment().subtract(10, 'years')
        expect(constraint.validate(new LocalDate(inPast.year(), 8, 8))).to.equal(false)
      })
    })
  })
})
