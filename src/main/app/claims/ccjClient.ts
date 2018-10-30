import { User } from 'idam/user'
import { request } from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { MadeBy } from 'offer/form/models/madeBy'

export class CCJClient {

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

  static redetermination (externalId: string, reDetermination: ReDetermination, user: User, madeBy: MadeBy) {
    return request.post(`${claimStoreApiUrl}/${externalId}/re-determination`, {
      body: { explanation: reDetermination.text, partyType: madeBy.value },
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
