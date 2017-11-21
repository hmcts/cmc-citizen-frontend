/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import { PayBySetDate } from 'response/draft/payBySetDate'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { LocalDate } from 'forms/models/localDate'
import { Explanation } from 'response/form/models/pay-by-set-date/explanation'

describe('PayBySetDate', () => {
  let payBySetDate: PayBySetDate

  beforeEach(() => {
    payBySetDate = new PayBySetDate(
      new PaymentDate(new LocalDate(2017, 11, 16)),
      new Explanation('I can not pay now')
    )
  })

  describe('constructor', () => {
    it('should set the fields', () => {
      expect(payBySetDate.paymentDate).to.not.be.undefined
      expect(payBySetDate.explanation).to.not.be.undefined
    })
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
})
