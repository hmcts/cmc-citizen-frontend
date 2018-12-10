import { request as requestPromiseApi, RequestPromiseAPI } from 'main/app/client/request'
import { User } from 'main/app/idam/user'
import * as config from 'config'
import { trackCustomEvent } from 'logging/customEventTracker'

let featureTogglesApiUrl: string

export class FeatureTogglesClient {

  constructor (public featureTogglesApiBaseUrl?: string,
               private request: RequestPromiseAPI = requestPromiseApi) {
    if (!featureTogglesApiBaseUrl) {
      featureTogglesApiBaseUrl = `${config.get<string>('feature-toggles-api.url')}`
    }
    featureTogglesApiUrl = `${featureTogglesApiBaseUrl}/api/ff4j/check`
  }

  async isAdmissionsAllowed (user: User, roles: string[]): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return this.request
      .get(`${featureTogglesApiUrl}/cmc_admissions`, {
        headers: {
          'X-USER-ID': `${user.email}`,
          'X-USER-PERMISSIONS': roles.join(',')
        }
      })
      .then((value: any) => {
        if (!value) {
          return Promise.resolve(false)
        }
        return Promise.resolve(true)
      })
      .catch((error: any) => {
        trackCustomEvent('ff4J cmc_admissions failure', { errorValue: error })
        return Promise.resolve(false)
      })
  }
}
