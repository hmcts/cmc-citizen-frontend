import { request as requestPromiseApi, RequestPromiseAPI } from 'client/request'
import { User } from 'idam/user'
import * as config from 'config'

export const featureTogglesApiBaseUrl: string = `${config.get<string>('feature-toggles-api.url')}`
const featureTogglesApiUrl: string = `${featureTogglesApiBaseUrl}/api/ff4j/check/cmc_admissions`

export class FeatureTogglesClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  retrieveUserRoles (user: User, permissions: string): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return this.request
      .get(`${featureTogglesApiUrl}`, {
        headers: {
          'X-USER-ID': `${user.email}`,
          'X-USER-PERMISSIONS': permissions
        }
      })
      .then((isPermitted: boolean) => {
        return isPermitted
      })
  }
}
