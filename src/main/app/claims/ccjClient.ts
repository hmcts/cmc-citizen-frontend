import { User } from 'idam/user'
import { request } from 'client/request'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { MadeBy } from 'claims/models/madeBy'

export class CCJClient {

  static async request (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static async redetermination (externalId: string, reDetermination: ReDetermination, user: User, madeBy: MadeBy) {
    return request.post(`${claimStoreApiUrl}/${externalId}/re-determination`, {
      body: { explanation: reDetermination.text, partyType: madeBy.value },
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
