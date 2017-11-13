import { UpdateResponseDeadlineRequest } from 'testing-support/models/updateResponseDeadlineRequest'
import { User } from 'idam/user'
import * as config from 'config'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { request } from 'client/request'

const testingSupportUrl = `${claimApiBaseUrl}/testing-support/claims`

export class TestingSupportClient {

  static updateResponseDeadline (updateRequest: UpdateResponseDeadlineRequest, user: User) {
    if (config.get('featureToggles.testingSupport')) {
      return request.put(
        `${testingSupportUrl}/${updateRequest.claimNumber}/response-deadline/${updateRequest.date.asString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.bearerToken}`
          }
        })
    } else {
      throw new Error('Testing support is not enabled')
    }
  }
}
