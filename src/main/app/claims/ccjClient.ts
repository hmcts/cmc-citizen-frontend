import { User } from 'idam/user'
import { request } from 'client/request'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'

export class CCJClient {

  static async request (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

}
