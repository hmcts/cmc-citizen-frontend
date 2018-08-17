import { User } from 'idam/user'
import { request } from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

export class CCJClient {
  static async persistCCJ (externalId: string, issue: boolean, countyCourtJudgment: CountyCourtJudgment, user: User) {

    let ccjUri: string

    if (issue) {
      ccjUri = `${claimStoreApiUrl}/${externalId}/county-court-judgment?issue=true`
    } else {
      ccjUri = `${claimStoreApiUrl}/${externalId}/county-court-judgment`
    }

    return request.post(ccjUri, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static save (externalId: string, draft: Draft<DraftCCJ>, user: User): Promise<Claim> {
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convert(draft.document)
    const issue: boolean = false

    return CCJClient.persistCCJ(externalId, issue, countyCourtJudgment, user)
  }
}
