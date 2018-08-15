import * as config from 'config'

import { FeatureToggleService } from '@hmcts/feature-toggle-client'

import { request as requestPromiseApi } from 'client/request'
import { User } from 'idam/user'

const service = new FeatureToggleService(config.get<string>('feature-toggles-api.url'), requestPromiseApi)

export class FeatureTogglesService {

  isAdmissionsAllowed (user: User, roles: string[]): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return service.isFeatureEnabled('cmc_admissions', user.email, roles.join(','))
  }
}
