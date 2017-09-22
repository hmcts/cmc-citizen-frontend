import User from 'app/idam/user'
import request from 'client/request'
import { CCJModelConverter } from 'claims/ccjModelConverter'
import { MomentFactory } from 'common/momentFactory'
import { DATE_FORMAT } from 'utils/momentFormatter'
import { claimStoreApiUrl } from 'claims/claimStoreClient'

export class CCJClient {
  static save (user: User): Promise<object> {
    const convertedDraft = CCJModelConverter.convert(user.ccjDraft)

    console.log(`${claimStoreApiUrl}/${user.claim.id}/county-court-judgment`)
    console.log(convertedDraft)

    return request.post(`${claimStoreApiUrl}/${user.claim.id}/county-court-judgment`, {
      body: convertedDraft,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`
      }
    })
  }

  static retrieve (externalId: number): Promise<object> {
    if (!externalId) {
      return Promise.reject(new Error('External ID is required'))
    }

    return Promise.resolve({
      defendantName: 'Jonny jones',
      judgmentDeadline: MomentFactory.currentDate().add(20, 'days').format(DATE_FORMAT)
    })
  }
}
