/* tslint:disable:no-unused-expression */
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000
const TOTAL_AMOUNT_2 = 1643.20

describe('calculateMonthlyPaymentLength', () => {

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

  it('should return a payment length of 15 months', () => {
    const instalmentAmount = 69
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('15 months')
  })

  it('should return a payment length of 30 months', () => {
    const instalmentAmount = 34
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('30 months')
  })

  it('should return a payment length of 67 months', () => {
    const instalmentAmount = 15
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('67 months')
  })
})

describe('calculateWeeklyPaymentLength', () => {

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

  it('should return a payment length of 20 weeks', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('20 weeks')
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

  it('should return a payment length of 7 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('7 weeks')
  })

  it('should return a payment length of 83 weeks(where the last instalment is partial)', () => {
    const instalmentAmount = 20
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('83 weeks')
  })

  it('should return a payment length of 165 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 10
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('165 weeks')
  })
})

describe('calculateBiWeeklyPaymentLength', () => {

  it('should return a payment length of 2 weeks payment full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

  it('should return a payment length of 8 weeks', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('8 weeks')
  })

  it('should return a payment length of 40 weeks', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('40 weeks')
  })

  it('should return a payment length of 4 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('4 weeks')
  })

  it('should return a payment length of 8 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('8 weeks')
  })

  it('should return a payment length of 14 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 250
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY, moment('2018-01-01'))
    expect(paymentPlan.calculatePaymentLength()).to.equal('14 weeks')
  })

  it('should return a payment length of 66 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('66 weeks')
  })

  it('should return a payment length of 330 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 10
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('330 weeks')
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
