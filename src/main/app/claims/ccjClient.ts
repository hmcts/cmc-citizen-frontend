import { User } from 'idam/user'
import { request } from 'client/request'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { MadeBy } from 'claims/models/madeBy'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

const serviceAuthTokenFactory = new ServiceAuthTokenFactoryImpl()

export class CCJClient {

  static async request (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    })
  }

  static async redetermination (externalId: string, reDetermination: ReDetermination, user: User, madeBy: MadeBy) {
    const serviceAuthToken = await serviceAuthTokenFactory.get()
    return request.post(`${claimStoreApiUrl}/${externalId}/re-determination`, {
      body: { explanation: reDetermination.text, partyType: madeBy.value },
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
      }
    })
  }
}
