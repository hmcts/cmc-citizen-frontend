import { Offer as OfferForm } from 'offer/form/models/offer'
import { Offer } from 'claims/models/offer'

export class OfferModelConverter {

  static convert (offerForm: OfferForm): Offer {
    if (offerForm && offerForm.offerText) {
      return new Offer(
                offerForm.offerText,
                offerForm.completionDate.asString()
            )
    }
    return undefined
  }

}
