import { request as requestPromiseApi, RequestPromiseAPI } from 'main/app/client/request'
import { User } from 'main/app/idam/user'
import * as config from 'config'

import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('FeatureTogglesClient')

export const featureTogglesApiBaseUrl: string = `${config.get<string>('feature-toggles-api.url')}`
const featureTogglesApiUrl: string = `${featureTogglesApiBaseUrl}/api/ff4j/check`

export class FeatureTogglesClient {
  constructor (private request: RequestPromiseAPI = requestPromiseApi) {
    // Nothing to do
  }

  async isAdmissionsAllowed (user: User, roles: string[]): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    logger.info('user: ' + user.email)
    logger.info('roles: ' + roles.join(','))

    return this.request
      .get(`${featureTogglesApiUrl}/cmc_admissions`, {
        headers: {
          'X-USER-ID': `${user.email}`,
          'X-USER-PERMISSIONS': roles.join(',')
        }
      })
  }
}
