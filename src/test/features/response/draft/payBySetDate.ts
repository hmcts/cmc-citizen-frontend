/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { PayBySetDate } from 'response/draft/payBySetDate'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { LocalDate } from 'forms/models/localDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'

describe('PayBySetDate', () => {
  describe('constructor', () => {
    it('should set the fields', () => {
      const payBySetDate: PayBySetDate = new PayBySetDate(
        new PaymentDate(new LocalDate(2017, 11, 16)),
        new Explanation('I can not pay now')
      )
      expect(payBySetDate.paymentDate).to.not.be.undefined
      expect(payBySetDate.explanation).to.not.be.undefined
    })
  })

  describe('clearExplanation', () => {
    it('should set the explanation to undefined', () => {
      const payBySetDate: PayBySetDate = new PayBySetDate(
        new PaymentDate(new LocalDate(2017, 11, 16)),
        new Explanation('I can not pay now')
      )
      payBySetDate.clearExplanation()
      expect(payBySetDate.explanation).to.be.undefined
    })
  })
})
