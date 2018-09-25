import { User } from 'idam/user'
import { request } from 'client/request'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'

export class CCJClient {

  static async issue (claim: Claim, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    return CCJClient.save(claim.externalId, countyCourtJudgment, user, true)
  }

  static async request (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    return CCJClient.save(externalId, countyCourtJudgment, user, false)
  }

  private static async save (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User, issue: boolean = false): Promise<Claim> {
    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment?issue=${issue}`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
