import { Frequency } from 'common/frequency/frequency'
import { expect } from 'chai'
import { FrequencyViewFilter } from 'claimant-response/filters/frequency-view-filter'
import { PaymentFrequency } from 'claims/models/response/core/paymentFrequency'

describe('Frequency view filter', () => {
  context('render frequency', () => {
    Frequency.all()
      .forEach(frequency => {
        it(`should render ${frequency} as ${frequency.displayValue}`, () => {
          expect(FrequencyViewFilter.render(frequency)).to.equal(frequency.displayValue)
        })
      })

    it('should throw an error for null', () => {
      expect(() => FrequencyViewFilter.render(null)).to.throw(TypeError)
    })
  })

  context('render payment frequency', () => {

    it(`should render payment frequency ${PaymentFrequency.WEEK} as ${Frequency.WEEKLY.displayValue}`, () => {
      expect(FrequencyViewFilter.renderPaymentFrequency(
        Frequency.toPaymentFrequency(Frequency.of(PaymentFrequency.WEEK)))).to.equal(Frequency.WEEKLY.displayValue)
    })

    it(`should render payment frequency ${PaymentFrequency.TWO_WEEKS} as ${Frequency.TWO_WEEKLY.displayValue}`,
      () => {
        expect(FrequencyViewFilter.renderPaymentFrequency(
          Frequency.toPaymentFrequency(Frequency.of(PaymentFrequency.TWO_WEEKS)
          ))).to.equal(Frequency.TWO_WEEKLY.displayValue)
      }
    )

    it(`should render payment frequency ${PaymentFrequency.FOUR_WEEKS} as ${Frequency.FOUR_WEEKLY.displayValue}`,
      () => {
        expect(FrequencyViewFilter.renderPaymentFrequency(
          Frequency.toPaymentFrequency(Frequency.of(PaymentFrequency.FOUR_WEEKS)
          ))).to.equal(Frequency.FOUR_WEEKLY.displayValue)
      }
    )

    it(`should render payment frequency ${PaymentFrequency.MONTH} as ${Frequency.MONTHLY.displayValue}`,
      () => {
        expect(FrequencyViewFilter.renderPaymentFrequency(
          Frequency.toPaymentFrequency(Frequency.of(PaymentFrequency.MONTH)
          ))).to.equal(Frequency.MONTHLY.displayValue)
      }
    )

    it('should throw an error for null', () => {
      expect(() => FrequencyViewFilter.renderPaymentFrequency(null)).to.throw(TypeError)
    })
  })
})
