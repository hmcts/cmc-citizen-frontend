import { OfferModelConverter } from 'claims/offerModelConvertor'
import { Offer } from 'claims/models/offer'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { Offer as OfferForm } from 'features/offer/form/models/offer'
import * as config from 'config'
import { request as requestPromiseApi, RequestPromiseAPI } from 'client/request'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class OfferClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  makeOffer (externalId: string, user: User, offerForm: OfferForm): Promise<Claim> {
    const offer: Offer = OfferModelConverter.convert(offerForm)
    return this.request.post(`${claimStoreApiUrl}/${externalId}/offers/defendant`, {
      body: offer,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  acceptOffer (externalId: string, user: User): Promise<Claim> {
    return this.request.post(`${claimStoreApiUrl}/${externalId}/offers/claimant/accept`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  rejectOffer (externalId: string, user: User): Promise<Claim> {
    return this.request.post(`${claimStoreApiUrl}/${externalId}/offers/claimant/reject`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  countersignOffer (externalId: string, user: User): Promise<Claim> {
    return this.request.post(`${claimStoreApiUrl}/${externalId}/offers/defendant/countersign`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
