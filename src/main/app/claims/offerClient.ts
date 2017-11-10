import { OfferModelConverter } from 'claims/offerModelConvertor'
import { Offer } from 'claims/models/offer'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { Offer as OfferForm } from 'features/offer/form/models/offer'
import * as config from 'config'
import { request } from 'client/request'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class OfferClient {

  static makeOffer (user: User, offerForm: OfferForm): Promise<Claim> {
    const claim: Claim = user.claim
    const offer: Offer = OfferModelConverter.convert(offerForm)
    return request.post(`${claimStoreApiUrl}/${claim.id}/offers/defendant`, {
      body: offer,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static acceptOffer (user: User): Promise<Claim> {
    const claim: Claim = user.claim
    return request.post(`${claimStoreApiUrl}/${claim.id}/offers/claimant/accept`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static rejectOffer (user: User): Promise<Claim> {
    const claim: Claim = user.claim
    return request.post(`${claimStoreApiUrl}/${claim.id}/offers/claimant/reject`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
