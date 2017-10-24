import { Offer as OfferForm } from 'offer/form/models/offer'
import { Offer } from 'claims/models/offer'

export class OfferModelConverter {

  static convert (offerForm: OfferForm): Offer {
    return new Offer(
              offerForm.offerText,
              offerForm.completionDate.toMoment()
          )
  }
}
