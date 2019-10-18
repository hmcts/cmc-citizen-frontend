import { OfferModelConverter } from 'claims/offerModelConvertor'
import { Offer } from 'claims/models/offer'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { Offer as OfferForm } from 'features/offer/form/models/offer'
import * as config from 'config'
import { request } from 'client/request'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class OfferClient {

  static makeOffer (externalId: string, user: User, offerForm: OfferForm): Promise<Claim> {
    const offer: Offer = OfferModelConverter.convert(offerForm)

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant`,
      body: offer,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static acceptOffer (externalId: string, user: User): Promise<Claim> {
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/accept`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static rejectOffer (externalId: string, user: User): Promise<Claim> {
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/reject`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static countersignOffer (externalId: string, user: User): Promise<Claim> {
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant/countersign`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }
}
