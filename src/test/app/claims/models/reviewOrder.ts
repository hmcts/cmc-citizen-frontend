import { MomentFactory } from 'shared/momentFactory'
import { ReviewOrder } from 'claims/models/reviewOrder'
import { expect } from 'chai'

describe('Review Order', () => {
  describe('deserialize', () => {
    it('should return undefined when undefined input given', () => {
      const actual: ReviewOrder = new ReviewOrder().deserialize(undefined)

      expect(actual.reason).to.be.eq(undefined)
    })

    it('should deserialize valid JSON to valid instance of Review Order object', () => {
      const input = {
        reason: 'some reason',
        requestedBy: 'CLAIMANT',
        requestedAt: MomentFactory.parse('2019-01-01').toISOString()
      }

      const reviewOrder = new ReviewOrder().deserialize(input)

      expect(reviewOrder).to.be.instanceOf(ReviewOrder)
    })
  })
})
