import { sampleOrdersDraftObj } from 'test/http-mocks/draft-store'
import { Claim } from 'claims/models/claim'
import { sampleClaimIssueObj } from 'test/http-mocks/claim-store'
import { OrdersDraft } from 'orders/draft/ordersDraft'
import { ReviewOrder } from 'claims/models/reviewOrder'
import { OrdersConverter } from 'claims/ordersConverter'
import { expect } from 'chai'
import { MadeBy } from 'claims/models/madeBy'

const user = {
  id: '1',
  bearerToken: 'SuperSecretToken'
}

describe('OrdersConverter', () => {
  it('should convert orders draft to Review Order instance', () => {
    const ordersDraft: OrdersDraft = new OrdersDraft().deserialize(sampleOrdersDraftObj)
    const claim: Claim = new Claim().deserialize(sampleClaimIssueObj)

    const reviewOrder: ReviewOrder = OrdersConverter.convert(ordersDraft, claim, user)
    expect(reviewOrder).to.be.instanceOf(ReviewOrder)
  })

  it('should convert orders draft to Review Order', () => {
    const ordersDraft: OrdersDraft = new OrdersDraft().deserialize(sampleOrdersDraftObj)
    const claim: Claim = new Claim().deserialize(sampleClaimIssueObj)

    const reviewOrder: ReviewOrder = OrdersConverter.convert(ordersDraft, claim, user)

    expect(reviewOrder.reason).to.equal('I want a judge to review it')
    expect(reviewOrder.requestedBy).to.equal(MadeBy.CLAIMANT.value)
  })
})
