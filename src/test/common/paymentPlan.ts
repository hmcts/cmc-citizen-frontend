/* tslint:disable:no-unused-expression */
import { createPaymentPlan } from 'common/paymentPlan'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000

describe('PaymentPlan', () => {
  describe('getLastPaymentDate', () => {
    it('should return the last payment date from given fromDate', () => {
      const instalmentAmount = 10
      const fromDate = moment('2018-01-01')
      const numberOfInstalmentsInWeeks = 200
      const expectedLastPaymentDate = fromDate.clone().add(numberOfInstalmentsInWeeks, 'weeks')
      const frequencyInWeeks = 2

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getLastPaymentDate(fromDate).isSame(expectedLastPaymentDate)).to.be.true
    })
  })

  describe('getPaymentLength', () => {
    it('should return a payment length that has no year showing', () => {
      const instalmentAmount = 105
      const frequencyInWeeks = 4

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('8 months 3 weeks')
    })

    it('should return a payment length that has exactly 1 year showing', () => {
      const instalmentAmount = 80
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('1 year 2 months 1 week')
    })

    it('should return a payment length that has more than 1 year showing', () => {
      const instalmentAmount = 20
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('4 years 9 months 2 weeks')
    })

    it('should return a payment length that has no month showing', () => {
      const instalmentAmount = 94
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('1 year 1 week')
    })

    it('should return a payment length that has exactly 1 month showing', () => {
      const instalmentAmount = 85
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('1 year 1 month 2 weeks')
    })

    it('should return a payment length that has more than 1 month showing', () => {
      const instalmentAmount = 70
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('1 year 4 months 1 week')
    })

    it('should return a payment length that has no week showing', () => {
      const instalmentAmount = 25
      const frequencyInWeeks = 5

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('3 years 10 months')
    })

    it('should return a payment length that has exactly 1 week showing', () => {
      const instalmentAmount = 1000
      const frequencyInWeeks = 1

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('1 week')
    })

    it('should return a payment length that has more than 1 week showing', () => {
      const instalmentAmount = 1000
      const frequencyInWeeks = 2

      const paymentPlan = createPaymentPlan(TOTAL_AMOUNT, instalmentAmount, frequencyInWeeks)

      expect(paymentPlan.getPaymentLength()).to.equal('2 weeks')
    })
  })
})
