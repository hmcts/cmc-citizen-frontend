import { User } from 'idam/user'
import { request } from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft } from '@hmcts/draft-store-client'

export class CCJClient {
  static save (externalId: string, draft: Draft<DraftCCJ>, user: User): Promise<Claim> {
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convert(draft.document)

    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
