import { expect } from 'chai'
import * as moment from 'moment'

import { DateInFutureConstraint } from 'forms/validation/validators/isInFuture'

import { LocalDate } from 'app/forms/models/localDate'

describe('DateIsInFutureConstraint', () => {
  const constraint: DateInFutureConstraint = new DateInFutureConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given a date is undefined or null', () => {
        expect(constraint.validate(undefined)).to.equal(true)
        expect(constraint.validate(null)).to.equal(true)
      })

      it('given a valid date in the future', () => {
        let inFuture = moment().add(10, 'years')
        expect(constraint.validate(new LocalDate(inFuture.year(), 1, 1))).to.equal(true)
      })
    })

    describe('should return false when ', () => {
      it('given an invalid structure', () => {
        expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false)
      })
      it('given a valid date in the past', () => {
        expect(constraint.validate(new LocalDate(2000, 1, 1))).to.equal(false)
      })
      it('given today date', () => {
        let now = moment()
        expect(constraint.validate(new LocalDate(now.year(), now.month() + 1, now.date()))).to.equal(false)
      })
    })
  })
})
