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

    for (let paymentFrequency in PaymentFrequency) {
      Frequency.all()
        .forEach(frequency => {
          if (Frequency.of(paymentFrequency).inWeeks === frequency.inWeeks) {
            it(`should render payment frequency ${paymentFrequency} as ${frequency.displayValue}`, () => {
              expect(FrequencyViewFilter.renderPaymentFrequency(
                Frequency.toPaymentFrequency(Frequency.of(paymentFrequency)))).to.equal(frequency.displayValue)
            })
          } else {
            it(`should not render payment frequency ${paymentFrequency} as ${frequency.displayValue}`, () => {
              expect(FrequencyViewFilter.renderPaymentFrequency(
                Frequency.toPaymentFrequency(Frequency.of(paymentFrequency)))).to.not.equal(frequency.displayValue)
            })
          }
        })

      it('should throw an error for null', () => {
        expect(() => FrequencyViewFilter.renderPaymentFrequency(null)).to.throw(TypeError)
      })
    }
  })
})
