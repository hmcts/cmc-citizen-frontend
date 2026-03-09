import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import * as config from 'config'
import { request } from 'client/request'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

const serviceAuthTokenFactory = new ServiceAuthTokenFactoryImpl()

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class SettlementAgreementClient {

  async rejectSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/reject`,
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

  async countersignSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      method: 'POST',
      uri: `${claimStoreApiUrl}/${externalId}/settlement-agreement/countersign`,
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
