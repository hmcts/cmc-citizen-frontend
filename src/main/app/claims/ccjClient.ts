import User from 'app/idam/user'
import request from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import Claim from 'claims/models/claim'

export class CCJClient {
  static save (user: User): Promise<Claim> {
    const countyCourtJudgment: CountyCourtJudgment = CCJModelConverter.convert(user.ccjDraft.document)

    return request.post(`${claimStoreApiUrl}/${user.claim.id}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
