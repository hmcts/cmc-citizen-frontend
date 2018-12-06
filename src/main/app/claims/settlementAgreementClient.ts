import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import * as config from 'config'
import { request } from 'client/request'

export const claimStoreApiUrl: string = `${config.get<string>('claim-store.url')}/claims`

export class SettlementAgreementClient {

  rejectSettlementAgreement (externalId: string, user: User): Promise<Claim> {
    return request.post(`${claimStoreApiUrl}/${externalId}/settlement-agreement/reject`, {
      body: '',
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

}
