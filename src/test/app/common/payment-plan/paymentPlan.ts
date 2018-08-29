/* tslint:disable:no-unused-expression */
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000
const TOTAL_AMOUNT_2 = 1643.20

describe.only('calculateMonthlyPaymentLength', () => {

  it('should return a payment length of 1 month paying full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month')
  })

  it('should return a payment length of 2 months ', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 months')
  })

  it('should return a payment length of 10 months', () => {
    const instalmentAmount = 100
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('10 months')
  })

  it('should return a payment length of 11 months (where the last one is partial)', () => {
    const instalmentAmount = 150
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('11 months')
  })

  it('should return a payment length of 1 year 3 months', () => {
    const instalmentAmount = 69
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 3 months')
  })

  it('should return a payment length of 2 years 6 months', () => {
    const instalmentAmount = 34
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 years 6 months')
  })

  it('should return a payment length of 5 years 7 months', () => {
    const instalmentAmount = 15
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('5 years 7 months')
  })
})

describe.only('calculateWeeklyPaymentLength', () => {

  it('should return a payment length of 1 week payment full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 week')
  })

  it('should return a payment length of 2 weeks', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

  it('should return a payment length of 20 weeks / 4 months 2 weeks', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('4 months 2 weeks')
  })

  it('should return a payment length of 2 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

  it('should return a payment length of 4 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('4 weeks')
  })

  it('should return a payment length of 7 weeks / 1 m 2 w (where the last instalment is partial)', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month 2 weeks')
  })

  it('should return a payment length of 83 weeks / 1 y 6 m 4 w (where the last instalment is partial)', () => {
    const instalmentAmount = 20
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 7 months')
  })

  it('should return a payment length of 165 weeks / 3 y 2 m 4 w (where the last instalment is partial)', () => {
    const instalmentAmount = 10
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('3 years 1 month 4 weeks')
  })
})

describe.only('calculateBiWeeklyPaymentLength', () => {

  it('should return a payment length of 2 weeks payment full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

  it('should return a payment length of 8 weeks', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month 3 weeks')
  })

  it('should return a payment length of 40 weeks / 9 months 1 week', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('9 months 1 week')
  })

  it('should return a payment length of 4 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('4 weeks')
  })

  it('should return a payment length of 8 weeks / 1 month 3 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month 3 weeks')
  })

  it('should return a payment length of 14 weeks / 3 months (where the last instalment is partial)', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('3 months')
  })

  it('should return a payment length of 66 weeks / 1 y 3 m (where the last instalment is partial)', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 year 3 months')
  })

  it('should return a payment length of 329 weeks / 6 y 3 m 3 w (where the last instalment is partial)', () => {
    const instalmentAmount = 10
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('6 years 3 months 3 weeks')
  })
})

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

  describe('convertTo', () => {
    it('should return the payment plan converted to weekly frequency', () => {
      const instalmentAmount = 100

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
      const convertedPaymentPlan = paymentPlan.convertTo(Frequency.WEEKLY)

      expect(convertedPaymentPlan.instalmentAmount).to.equal(50)
      expect(convertedPaymentPlan.frequency).to.equal(Frequency.WEEKLY)
    })

    it('should return the payment plan converted to two-weekly frequency', () => {
      const instalmentAmount = 100

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
      const convertedPaymentPlan = paymentPlan.convertTo(Frequency.TWO_WEEKLY)

      expect(convertedPaymentPlan.instalmentAmount).to.equal(200)
      expect(convertedPaymentPlan.frequency).to.equal(Frequency.TWO_WEEKLY)
    })

    it('should return the payment plan converted to four-weekly frequency', () => {
      const instalmentAmount = 100

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
      const convertedPaymentPlan = paymentPlan.convertTo(Frequency.FOUR_WEEKLY)

      expect(convertedPaymentPlan.instalmentAmount).to.equal(400)
      expect(convertedPaymentPlan.frequency).to.equal(Frequency.FOUR_WEEKLY)
    })

    it('should return the payment plan converted to monthly frequency', () => {
      const instalmentAmount = 100

      const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
      const convertedPaymentPlan = paymentPlan.convertTo(Frequency.MONTHLY)

      expect(convertedPaymentPlan.instalmentAmount).to.equal(433.3333333333333)
      expect(convertedPaymentPlan.frequency).to.equal(Frequency.MONTHLY)
    })
  })
})
