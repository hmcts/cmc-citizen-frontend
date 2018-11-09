import { expect } from 'chai'
import { convertToRawObject } from 'test/rawObjectUtils'
import { PaymentIntention } from 'claims/models/response/core/paymentIntention'

import {
  immediatelyPaymentIntentionData,
  bySetDatePaymentIntentionData,
  weeklyInstalmentPaymentIntentionData,
  twoWeeklyInstalmentPaymentIntentionData,
  monthlyInstalmentPaymentIntentionData
} from 'test/data/entity/paymentIntentionData'

describe('PaymentIntention', () => {

  describe('deserialize', () => {

    it('should return undefined when undefined input given', () => {
      const actual: PaymentIntention = PaymentIntention.deserialize(undefined)

      expect(actual).to.be.eq(undefined)
    })

    const tests = [
      { type: 'immediatly', data: immediatelyPaymentIntentionData },
      { type: 'set date', data: bySetDatePaymentIntentionData },
      { type: 'weekly instalment', data: weeklyInstalmentPaymentIntentionData },
      { type: 'two weekly instament', data: twoWeeklyInstalmentPaymentIntentionData },
      { type: 'monthly instament', data: monthlyInstalmentPaymentIntentionData }
    ]

    tests.forEach(test =>
      it(`should deserialize valid JSON of type '${test.type}' to valid PaymentIntention object`, () => {
        const actual: PaymentIntention = PaymentIntention.deserialize(test.data)
        expect(convertToRawObject(actual)).to.be.deep.equal(test.data)
      })
    )
  })
})
