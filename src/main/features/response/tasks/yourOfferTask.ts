import { OfferDraft } from 'response/draft/offerDraft'

export class YourOfferTask {
  static isCompleted (offerDraft: OfferDraft): boolean {
    if (!offerDraft || offerDraft.settleOutOfCourt == null) {
      return false
    } else if (offerDraft.isSettleOutOfCourt() && offerDraft.offer) {
      return offerDraft.offer.text && offerDraft.offer.date ? true : false
    } else if (!offerDraft.isSettleOutOfCourt()) {
      return true
    } else {
      return false
    }
  }
}
