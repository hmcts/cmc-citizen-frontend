import { OfferModelConverter } from 'claims/offerModelConvertor'
import { Offer } from 'claims/models/offer'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { Offer as OfferForm } from 'features/offer/form/models/offer'
import * as config from 'config'
import { request } from 'client/request'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

const serviceAuthTokenFactory = new ServiceAuthTokenFactoryImpl()

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class OfferClient {

  static async makeOffer (externalId: string, user: User, offerForm: OfferForm): Promise<Claim> {
    const offer: Offer = OfferModelConverter.convert(offerForm)
    const serviceAuthToken = await serviceAuthTokenFactory.get()

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant`,
      body: offer,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static async acceptOffer (externalId: string, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/accept`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static async rejectOffer (externalId: string, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/claimant/reject`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  static async countersignOffer (externalId: string, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/offers/defendant/countersign`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }
}
