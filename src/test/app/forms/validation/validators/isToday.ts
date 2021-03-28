import { expect } from 'chai'
import * as moment from 'moment'

import { DateTodayOrInFutureConstraint } from 'forms/validation/validators/isToday'

import { LocalDate } from 'forms/models/localDate'

describe('DateTodayConstraint', () => {
  const constraint: DateTodayOrInFutureConstraint = new DateTodayOrInFutureConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {

      it('given a date is undefined', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given today date', () => {
        const now = moment()
        expect(constraint.validate(new LocalDate(now.year(), now.month(), now.date()))).to.equal(true)
      })
    })

    describe('should return false when ', () => {

      it('given an invalid structure', () => {
        expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false)
      })
    })
  })
})
