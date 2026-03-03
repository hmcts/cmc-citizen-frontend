import { User } from 'idam/user'
import { request } from 'client/request'
import { claimStoreApiUrl } from 'claims/claimStoreClient'
import { CountyCourtJudgment } from 'claims/models/countyCourtJudgment'
import { Claim } from 'claims/models/claim'
import { ReDetermination } from 'ccj/form/models/reDetermination'
import { MadeBy } from 'claims/models/madeBy'
import { ServiceAuthToken } from 'idam/serviceAuthToken'

export class CCJClient {
  constructor (private serviceAuthToken?: ServiceAuthToken) {
    // Nothing to do
  }

  async request (externalId: string, countyCourtJudgment: CountyCourtJudgment, user: User): Promise<Claim> {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    return request.post(`${claimStoreApiUrl}/${externalId}/county-court-judgment`, {
      body: countyCourtJudgment,
      headers
    })
  }

  async redetermination (externalId: string, reDetermination: ReDetermination, user: User, madeBy: MadeBy) {
    const headers: any = {
      Authorization: `Bearer ${user.bearerToken}`
    }
    if (this.serviceAuthToken) {
      headers['ServiceAuthorization'] = `Bearer ${this.serviceAuthToken.bearerToken}`
    }

    return request.post(`${claimStoreApiUrl}/${externalId}/re-determination`, {
      body: { explanation: reDetermination.text, partyType: madeBy.value },
      headers
    })
  }
}
