/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import * as moment from 'moment'

import { PaymentDateChecker } from 'response/helpers/paymentDateChecker'

describe('PaymentDateChecker', () => {
  describe('isLaterThan28DaysFromNow', () => {
    it('should return false for a date 27 days from now', () => {
      const date27DaysFromNow: moment.Moment = moment().add(27, 'days')
      expect(PaymentDateChecker.isLaterThan28DaysFromNow(date27DaysFromNow)).to.be.false
    })

    it('should return false for a date 28 days from now', () => {
      const date28DaysFromNow: moment.Moment = moment().add(28, 'days')
      expect(PaymentDateChecker.isLaterThan28DaysFromNow(date28DaysFromNow)).to.be.false
    })

    it('should return true for a date 29 days from now', () => {
      const date29DaysFromNow: moment.Moment = moment().add(29, 'days')
      expect(PaymentDateChecker.isLaterThan28DaysFromNow(date29DaysFromNow)).to.be.true
    })
  })
})
