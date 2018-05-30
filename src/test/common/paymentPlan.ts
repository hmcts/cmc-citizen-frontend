/* tslint:disable:no-unused-expression */
import { PaymentPlan } from 'common/paymentPlan'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000
const INSTALMENT_AMOUNT = 10

describe('PaymentPlan',() => {
  describe('getLastPaymentDate', () => {
    it('should return the last payment date from given fromDate', () => {
      const fromDate = moment('2018-01-01')
      const numberOfInstalmentsInWeeks = 100
      const expectedLastPaymentDate = fromDate.add(numberOfInstalmentsInWeeks)

      const frequencyInWeeks = 2
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const lastPaymentDate = paymentPlan.getLastPaymentDate(fromDate)

      expect(lastPaymentDate.isSame(expectedLastPaymentDate)).to.be.true
    })
  })

  describe('getPaymentLength', () => {
    it.only('should return a payment length that has no year showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('5 months 1 week')
    })

    it('should return a payment length that has exactly 1 year showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 5 months 2 weeks')
    })

    it('should return a payment length that has more than 1 year showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('2 years 5 months 2 weeks')
    })

    it('should return a payment length that has no month showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 2 weeks')
    })

    it('should return a payment length that has exactly 1 month showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 1 month 2 weeks')
    })

    it('should return a payment length that has more than 1 month showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 2 months 2 weeks')
    })

    it('should return a payment length that has no week showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 5 months')
    })

    it('should return a payment length that has exactly 1 week showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 5 months 1 week')
    })

    it('should return a payment length that has more than 1 week showing', () => {
      const frequencyInWeeks = 5
      const paymentPlan = new PaymentPlan(TOTAL_AMOUNT, INSTALMENT_AMOUNT, frequencyInWeeks)
      const paymentLength = paymentPlan.getPaymentLength()
      expect(paymentLength).to.equal('1 year 5 months 2 weeks')
    })
  })
})
