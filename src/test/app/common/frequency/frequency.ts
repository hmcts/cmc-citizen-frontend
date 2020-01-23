import { expect } from 'chai'
import { Frequency } from 'common/frequency/frequency'
import { PaymentSchedule } from 'claims/models/response/core/paymentSchedule'

describe('Frequency', () => {
  describe('of', () => {
    [
      { frequencyValue: 'WEEK', expectedFrequency: Frequency.WEEKLY },
      { frequencyValue: 'EACH_WEEK', expectedFrequency: Frequency.WEEKLY },
      { frequencyValue: 'TWO_WEEKS', expectedFrequency: Frequency.TWO_WEEKLY },
      { frequencyValue: 'EVERY_TWO_WEEKS', expectedFrequency: Frequency.TWO_WEEKLY },
      { frequencyValue: 'FOUR_WEEKS', expectedFrequency: Frequency.FOUR_WEEKLY },
      { frequencyValue: 'EVERY_FOUR_WEEKS', expectedFrequency: Frequency.FOUR_WEEKLY },
      { frequencyValue: 'MONTH', expectedFrequency: Frequency.MONTHLY },
      { frequencyValue: 'EVERY_MONTH', expectedFrequency: Frequency.MONTHLY }
    ].forEach(testCase => {
      it(`should return Frequency object for valid value input: ${testCase.frequencyValue}`, () => {
        const frequency: Frequency = Frequency.of(testCase.frequencyValue)

        expect(frequency instanceof Frequency).to.equal(true)
        expect(frequency).to.equal(testCase.expectedFrequency)
        expect(frequency.monthlyRatio).to.equal(testCase.expectedFrequency.monthlyRatio)
      })

      it('should throw exception for invalid input', () => {
        try {
          Frequency.of('unknown')
        } catch (e) {
          expect(e.message).to.equal(`There is no Frequency for value: 'unknown'`)
        }
      })
    })

    describe('ofWeekly', () => {
      [
        { frequencyWeeklyValue: 1, expectedFrequency: Frequency.WEEKLY },
        { frequencyWeeklyValue: 2, expectedFrequency: Frequency.TWO_WEEKLY },
        { frequencyWeeklyValue: 4, expectedFrequency: Frequency.FOUR_WEEKLY },
        { frequencyWeeklyValue: 52 / 12, expectedFrequency: Frequency.MONTHLY }
      ].forEach(testCase => {
        it(`should return Frequency object for valid weekly value input: ${testCase.frequencyWeeklyValue}`, () => {
          const frequency: Frequency = Frequency.ofWeekly(testCase.frequencyWeeklyValue)

          expect(frequency instanceof Frequency).to.equal(true)
          expect(frequency).to.equal(testCase.expectedFrequency)
          expect(frequency.monthlyRatio).to.equal(testCase.expectedFrequency.monthlyRatio)
        })
      })

      it('should throw exception for invalid input', () => {
        try {
          Frequency.ofWeekly(0)
        } catch (e) {
          expect(e.message).to.equal(`There is no Frequency for weekly value: '0'`)
        }
      })
    })

    describe('toPaymentSchedule', () => {
      it('should pass when frequency is converted to paymentSchedule for EVERY_TWO_WEEKS', () => {
        expect(Frequency.toPaymentSchedule(Frequency.of('EVERY_TWO_WEEKS'))).to.deep.equal(PaymentSchedule.EVERY_TWO_WEEKS)
      })

      it('should pass when frequency is converted to paymentSchedule for EACH_WEEK', () => {
        expect(Frequency.toPaymentSchedule(Frequency.of('EACH_WEEK'))).to.deep.equal(PaymentSchedule.EACH_WEEK)
      })

      it('should pass when frequency is converted to paymentSchedule for EVERY_MONTH', () => {
        expect(Frequency.toPaymentSchedule(Frequency.of('EVERY_MONTH'))).to.deep.equal(PaymentSchedule.EVERY_MONTH)
      })
    })
  })
})
