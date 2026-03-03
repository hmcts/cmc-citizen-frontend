import { OfferModelConverter } from 'claims/offerModelConvertor'
import { Offer } from 'claims/models/offer'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { Offer as OfferForm } from 'features/offer/form/models/offer'
import * as config from 'config'
import { request } from 'client/request'
import { ServiceAuthToken } from 'idam/serviceAuthToken'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class OfferClient {
  constructor (private serviceAuthToken?: ServiceAuthToken) {
    // Nothing to do
  }

  makeOffer (externalId: string, user: User, offerForm: OfferForm): Promise<Claim> {
    const offer: Offer = OfferModelConverter.convert(offerForm)

    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant`,
      body: offer,
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }

  acceptOffer (externalId: string, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/accept`,
      body: '',
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }

  rejectOffer (externalId: string, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/reject`,
      body: '',
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }

  countersignOffer (externalId: string, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant/countersign`,
      body: '',
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }
}
