/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { PayBySetDate } from 'response/form/models/payBySetDate'
import { LocalDate } from 'forms/models/localDate'

describe('PayBySetDate', () => {
  context('draft object deserialisation', () => {
    it('should return a fresh instance when given blank input', () => {
      const payBySetDate: PayBySetDate = new PayBySetDate().deserialize(undefined)
      expect(payBySetDate).to.deep.equal(new PayBySetDate())
    })

    it('should return an instance filled with values from given input object', () => {
      const input = {
        date: new LocalDate(1988, 2, 10),
        explanation: 'I do not want to pay now'
      }
      const payBySetDate: PayBySetDate = new PayBySetDate().deserialize(input)
      expect(payBySetDate.date).to.equal(input.date)
      expect(payBySetDate.explanation).to.equal(input.explanation)
    })
  })

  context('form object deserialisation', () => {
    it('should return undefined when given undefined input', () => {
      const payBySetDate: PayBySetDate = PayBySetDate.fromObject(undefined)
      expect(payBySetDate).to.be.undefined
    })

    it('should return properly deserialize form date into a Moment date', () => {
      const input = {
        date: {
          day: 10,
          month: 2,
          year: 1988
        },
        explanation: 'I do not want to pay now'
      }
      const payBySetDate: PayBySetDate = PayBySetDate.fromObject(input)
      expect(payBySetDate.date).to.deep.equal(new LocalDate(input.date.year, input.date.month, input.date.day))
      expect(payBySetDate.explanation).to.equal(input.explanation)
    })
  })
})
