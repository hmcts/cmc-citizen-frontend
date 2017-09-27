import User from 'app/idam/user'
import request from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'

export class CCJClient {
  static save (user: User): Promise<object> {
    const convertedDraft = CCJModelConverter.convert(user.ccjDraft)

    return request.post(`${claimStoreApiUrl}/${user.claim.id}/county-court-judgment`, {
      body: convertedDraft,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }
}
