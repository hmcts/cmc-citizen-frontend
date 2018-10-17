/* tslint:disable:no-unused-expression */
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import * as moment from 'moment'

const TOTAL_AMOUNT = 1000
const TOTAL_AMOUNT_2 = 1643.20
const TOTAL_AMOUNT_3 = 20

const frequencies = ['WEEK', 'TWO_WEEK', 'MONTH']

const TESTS = [
  {
    desc: 'return the correct value when instalment amount is reasonably high',
    claimAmount: 1600,
    instalmentAmount: 200,
    expected: { WEEK: '8 weeks', TWO_WEEK: '16 weeks', MONTH: '8 months' }
  },
  {
    desc: 'return lowest denomination when instalment amount is equal to claim amount',
    claimAmount: 100,
    instalmentAmount: 100,
    expected: { WEEK: '1 week', TWO_WEEK: '2 weeks', MONTH: '1 month' }
  },
  {
    desc: 'return the correct value when instalment amount is very low',
    claimAmount: 100,
    instalmentAmount: 1,
    expected: { WEEK: '100 weeks', TWO_WEEK: '200 weeks', MONTH: '100 months' }
  }
]

frequencies.forEach(frequency => {
  describe.only(`when the frequency is ${frequency}`, () => {
    TESTS.forEach(test => {
      it(test.desc, () => {
        const paymentPlan = PaymentPlan.create(test.claimAmount, test.instalmentAmount, Frequency.of(frequency))
        expect(paymentPlan.calculatePaymentLength()).to.equal(test.expected[frequency])
      })
    })
  })
})

describe('calculatePaymentLength', () => {

  it('should return the correct payment plan length with installment amount < 1£', () => {
    const instalmentAmount = 0.50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equals('40 weeks')
  })

  it('should return a payment plan length equal to the total amount if the installment amount is 1£', () => {
    const instalmentAmount = 1
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal(TOTAL_AMOUNT_3 + ' weeks')
  })

  it('should return the correct payment plan length with an installment amount with 1 decimal', () => {
    const instalmentAmount = 2.5
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('8 weeks')
  })

  it('should return the correct payment plan length with an installment amount with 2 decimal', () => {
    const instalmentAmount = 9.99
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equals('3 weeks')
  })

  it('should return the correct payment plan length with an installment amount with > 2 decimal', () => {
    const instalmentAmount = 6.666
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_3, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equals('4 weeks')
  })

})

describe('calculateMonthlyPaymentLength', () => {

  it('should return payment length in month(s) when selecting the MONTHLY option', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.contain('month')
  })

  it('should return a payment length of 1 month when paying full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month')
  })

  it('should return a payment length of 1 month when paying in amounts greater than the amount claimed', () => {
    const instalmentAmount = 2000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 month')
  })

  it('should return a payment length of 10 months when paying one tenth of full amount', () => {
    const instalmentAmount = 100
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('10 months')
  })

  it('should return a payment length of 11 months where the last one is partial', () => {
    const instalmentAmount = 150
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.MONTHLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('11 months')
  })
})

describe('calculateWeeklyPaymentLength', () => {

  it('should return a payment length in week(s) when option WEEKLY is selected', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.contain('week')
  })

  it('should return a payment length of 1 week when paying full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('1 week')
  })

  it('should return a payment length of 20 weeks when paying 1/20 for the full amount per installment', () => {
    const instalmentAmount = 50
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('20 weeks')
  })

  it('should return a payment length of 2 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

})

describe('calculateBiWeeklyPaymentLength', () => {

  it('should return a payment length in weeks when option TWO WEEKLY is selected', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.contain('week')
  })

  it('should return a payment length of 2 weeks when paying full amount', () => {
    const instalmentAmount = 1000
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('2 weeks')
  })

  it('should return a payment length of 8 weeks (where the last instalment is partial)', () => {
    const instalmentAmount = 500
    const paymentPlan = PaymentPlan.create(TOTAL_AMOUNT_2, instalmentAmount, Frequency.TWO_WEEKLY)
    expect(paymentPlan.calculatePaymentLength()).to.equal('8 weeks')
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
