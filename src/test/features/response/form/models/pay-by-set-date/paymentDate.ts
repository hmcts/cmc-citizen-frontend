/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { LocalDate } from 'forms/models/localDate'
import { PaymentDate } from 'response/form/models/pay-by-set-date/paymentDate'

describe('PaymentDate', () => {
  context('draft object deserialisation', () => {
    it('should return a fresh instance when given blank input', () => {
      const paymentDate: PaymentDate = new PaymentDate().deserialize(undefined)
      expect(paymentDate).to.deep.equal(new PaymentDate())
    })

    it('should return an instance filled with values from given input object', () => {
      const input = {
        date: new LocalDate(1988, 2, 10)
      }
      const paymentDate: PaymentDate = new PaymentDate().deserialize(input)
      expect(paymentDate.date).to.deep.equal(input.date)
    })
  })

  context('form object deserialisation', () => {
    it('should return undefined when given undefined input', () => {
      const paymentDate: PaymentDate = PaymentDate.fromObject(undefined)
      expect(paymentDate).to.be.undefined
    })

    it('should return properly deserialize form date into a Moment date', () => {
      const input = {
        date: {
          day: 10,
          month: 2,
          year: 1988
        }
      }
      const paymentDate: PaymentDate = PaymentDate.fromObject(input)
      expect(paymentDate.date).to.deep.equal(new LocalDate(input.date.year, input.date.month, input.date.day))
    })
  })
})
