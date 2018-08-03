import { request as requestPromiseApi, RequestPromiseAPI } from 'main/app/client/request'
import { User } from 'main/app/idam/user'
import * as config from 'config'

export const featureTogglesApiBaseUrl: string = `${config.get<string>('feature-toggles-api.url')}`
const featureTogglesApiUrl: string = `${featureTogglesApiBaseUrl}/api/ff4j/check`

export class FeatureTogglesClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  isAdmissionsAllowed (user: User, permissions: string): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return this.request
      .get(`${featureTogglesApiUrl}/cmc_admissions`, {
        headers: {
          'X-USER-ID': `${user.email}`,
          'X-USER-PERMISSIONS': permissions
        }
      })
  }
}
