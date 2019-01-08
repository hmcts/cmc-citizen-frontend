import { request as requestPromiseApi, RequestPromiseAPI } from 'main/app/client/request'
import { User } from 'main/app/idam/user'
import * as config from 'config'
import { trackCustomEvent } from 'logging/customEventTracker'

export class FeatureTogglesClient {

  featureTogglesApiUrl: string

  constructor (private featureTogglesApiBaseUrl?: string,
               private request: RequestPromiseAPI = requestPromiseApi) {

    this.featureTogglesApiUrl = `${featureTogglesApiBaseUrl}/api/ff4j/check`
    if (!this.featureTogglesApiBaseUrl) {
      this.featureTogglesApiUrl = `${config.get<string>('feature-toggles-api.url')}/api/ff4j/check`
    }
  }

  async isAdmissionsAllowed (user: User, roles: string[]): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return this.request
      .get(`${this.featureTogglesApiUrl}/cmc_admissions`, {
        headers: {
          'X-USER-ID': `${user.email}`,
          'X-USER-PERMISSIONS': roles.join(',')
        }
      })
      .then((value: any) => {
        return Promise.resolve(!!value)
      })
      .catch((error: any) => {
        trackCustomEvent('ff4J cmc_admissions failure', { errorValue: error })
        return Promise.resolve(false)
      })
  }
}
