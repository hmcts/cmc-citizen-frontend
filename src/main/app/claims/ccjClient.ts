import { User } from 'idam/user'
import { request } from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

export class CCJClient {

  static async issue (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    return CCJClient.save(externalId, countyCourtJudgment, user, true)
  }

  static async request (externalId: string, draft: Draft<DraftCCJ>, user: User): Promise<Claim> {
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convertForRequest(draft.document)
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
