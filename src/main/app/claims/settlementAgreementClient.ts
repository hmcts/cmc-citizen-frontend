import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import * as config from 'config'
import { request } from 'client/request'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class SettlementAgreementClient {

  rejectSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/reject`,
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    }

    return request(options).then(function (response) {
      return response
    })
  }

  countersignSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/countersign`,
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
