import { UpdateResponseDeadlineRequest } from 'testing-support/models/updateResponseDeadlineRequest'
import { User } from 'idam/user'
import { claimApiBaseUrl } from 'claims/claimStoreClient'
import { request } from 'client/request'
import { FeatureToggles } from 'utils/featureToggles'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

const serviceAuthTokenFactory = new ServiceAuthTokenFactoryImpl()

const testingSupportUrl = `${claimApiBaseUrl}/testing-support/claims`

export class TestingSupportClient {

  static async updateResponseDeadline (updateRequest: UpdateResponseDeadlineRequest, user: User) {
    if (FeatureToggles.isEnabled('testingSupport')) {
      const serviceAuthToken = await serviceAuthTokenFactory.get()
      return request.put(
        `${testingSupportUrl}/${updateRequest.claimNumber}/response-deadline/${updateRequest.date.asString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.bearerToken}`,
            ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`
          }
        })
    } else {
      throw new Error('Testing support is not enabled')
    }
  }
}
