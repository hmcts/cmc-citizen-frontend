/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { OrdersDraft } from 'orders/draft/ordersDraft'

describe('OrdersDraft', () => {

  describe('deserialization', () => {

    it('should return an OrdersDraft instance initialised with defaults for undefined', () => {
      expect(new OrdersDraft().deserialize(undefined)).to.eql(new OrdersDraft())
    })

    it('should return a OrdersDraft instance initialised with defaults for null', () => {
      expect(new OrdersDraft().deserialize(null)).to.eql(new OrdersDraft())
    })

    it('should return a ResponseDraft instance initialised with valid data (order)', () => {
      const draft: OrdersDraft = new OrdersDraft().deserialize({
        disagreeReason: {
          reason: 'I want a judge to review the order'
        }
      })

      expect(draft.disagreeReason.reason).to.eql('I want a judge to review the order')
    })
  })
})
