/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { PayBySetDate } from 'response/draft/payBySetDate'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { LocalDate } from 'forms/models/localDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'
import { MomentFactory } from 'common/momentFactory'
import { localDateFrom } from '../../../localDateUtils'

describe('PayBySetDate', () => {
  let payBySetDate: PayBySetDate

  beforeEach(() => {
    payBySetDate = new PayBySetDate(
      new PaymentDate(localDateFrom(MomentFactory.currentDate())),
      new Explanation('I can not pay now')
    )
  })

  describe('clearExplanation', () => {
    it('should set the explanation to undefined', () => {
      payBySetDate.clearExplanation()
      expect(payBySetDate.explanation).to.be.undefined
    })
  })

  describe('hasExplanation', () => {
    it('should return true when explanation with non-blank text is provided', () => {
      expect(payBySetDate.hasExplanation()).to.be.true
    })

    it('should return false undefined explanation text is provided', () => {
      payBySetDate.explanation = undefined
      expect(payBySetDate.hasExplanation()).to.be.false
    })

    it('should return false when explanation with undefined text is provided', () => {
      payBySetDate.explanation.text = undefined
      expect(payBySetDate.hasExplanation()).to.be.false
    })

    it('should return false when explanation with blank string is provided', () => {
      payBySetDate.explanation.text = ''
      expect(payBySetDate.hasExplanation()).to.be.false
    })

    it('should return false when explanation with whitespace only string is provided', () => {
      payBySetDate.explanation.text = '      '
      expect(payBySetDate.hasExplanation()).to.be.false
    })
  })

  describe('requiresExplanation', () => {
    it('should not require explanation if payment date is not provided', () => {
      payBySetDate.paymentDate.date = undefined
      expect(payBySetDate.requiresExplanation()).to.be.false
    })

    it('should not require explanation if payment date is invalid', () => {
      payBySetDate.paymentDate.date = new LocalDate()
      expect(payBySetDate.requiresExplanation()).to.be.false
    })

    it('should not require explanation if payment date is today', () => {
      expect(payBySetDate.requiresExplanation()).to.be.false
    })

    it('should require explanation if payment date month away', () => {
      payBySetDate.paymentDate.date = localDateFrom(MomentFactory.currentDate().add(1, 'month'))
      expect(payBySetDate.requiresExplanation()).to.be.true
    })
  })
})
