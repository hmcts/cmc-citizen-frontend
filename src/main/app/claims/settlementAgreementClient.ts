import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import * as config from 'config'
import { request } from 'client/request'
import { ServiceAuthToken } from 'idam/serviceAuthToken'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class SettlementAgreementClient {
  constructor (private serviceAuthToken?: ServiceAuthToken) {
    // Nothing to do
  }

  rejectSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/reject`,
      body: '',
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }

  countersignSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/countersign`,
      body: '',
      headers
    }

    return request(options).then(function (response) {
      return response
    })
  }

}
