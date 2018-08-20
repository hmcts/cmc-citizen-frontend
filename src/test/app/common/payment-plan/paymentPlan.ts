/* tslint:disable:no-unused-expression */
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000

describe('PaymentPlan', () => {
  describe('calculateLastPaymentDate', () => {
    it('should return the last payment date from given start date', () => {
      const instalmentAmount = 10
      const fromDate = moment('2018-01-01')
      const numberOfInstalmentsInWeeks = 200
      const expectedLastPaymentDate = fromDate.clone().add(numberOfInstalmentsInWeeks, 'weeks')

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY, fromDate)

      expect(paymentPlan.calculateLastPaymentDate().isSame(expectedLastPaymentDate)).to.be.true
    })
  })

  describe('calculatePaymentLength', () => {
    it('should return a payment length that has no year showing', () => {
      const instalmentAmount = 105

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('8 months 3 weeks')
    })

    it('should return a payment length that has exactly 1 year showing', () => {
      const instalmentAmount = 60

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 3 months 1 week')
    })

    it('should return a payment length that has more than 1 year showing', () => {
      const instalmentAmount = 15

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('5 years 1 month 1 week')
    })

    it('should return a payment length that has no month showing', () => {
      const instalmentAmount = 71

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 4 weeks')
    })

    it('should return a payment length that has exactly 1 month showing', () => {
      const instalmentAmount = 69

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 1 month 1 week')
    })

    it('should return a payment length that has more than 1 month showing', () => {
      const instalmentAmount = 64

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 2 months 1 week')
    })

    it('should return a payment length that has no week showing', () => {
      const instalmentAmount = 34

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('2 years 3 months')
    })

    it('should return a payment length that has exactly 1 week showing', () => {
      const instalmentAmount = 1000

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('1 week')
    })

    it('should return a payment length that has more than 1 week showing', () => {
      const instalmentAmount = 1000

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)

      expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
    })
  })

  describe('calculateMonthlyInstalmentAmount', () => {
    it('should return the instalment amount converted to monthly frequency', () => {
      const instalmentAmount = 100

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)

      expect(paymentPlan.calculateMonthlyInstalmentAmount()).to.equal(216.66666666666666)
    })
  })
})
