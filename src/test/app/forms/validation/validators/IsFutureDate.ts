import { expect } from 'chai'
import * as moment from 'moment'

import { DateFutureConstraint } from 'forms/validation/validators/dateFutureConstraint'

import { LocalDate } from 'app/forms/models/localDate'

describe('DateFutureConstraint', () => {
  const constraint: DateFutureConstraint = new DateFutureConstraint()

  describe('validate', () => {

    describe('should return true when ', () => {
      it('given a date is undefined', () => {
        expect(constraint.validate(undefined)).to.equal(true)
      })

      it('given a valid date in the future', () => {
        let inFuture = moment().add(10, 'years')
        expect(constraint.validate(new LocalDate(inFuture.year(), 1, 1))).to.equal(true)
      })

      it('given today date', () => {
        let now = moment()
        expect(constraint.validate(new LocalDate(now.year(), now.month() + 1, now.date()))).to.equal(false)
      })
    })

    describe('should return false when ', () => {
      it('given an invalid structure', () => {
        expect(constraint.validate({ a: 1, b: 1, c: 2000 })).to.equal(false)
      })

      it('given a date in the past', () => {
        let inPast = moment().subtract(10, 'years')
        expect(constraint.validate(new LocalDate(inPast.year(), 8, 8))).to.equal(false)
      })
    })
  })
})
