import { OrdersDraft } from 'orders/draft/ordersDraft'
import { MomentFactory } from 'shared/momentFactory'
import { Claim } from 'claims/models/claim'
import { RequestedBy, ReviewOrder } from 'claims/models/reviewOrder'

export class OrdersConverter {
  static convert (ordersDraft: OrdersDraft, claim: Claim, user: User): ReviewOrder {
    if (!ordersDraft) {
      return undefined
    }

    return new ReviewOrder(ordersDraft.disagreeReason.reason,
      claim.claimantId === user.id ? RequestedBy.CLAIMANT : RequestedBy.DEFENDANT,
      MomentFactory.currentDateTime()
    )
  }
}
