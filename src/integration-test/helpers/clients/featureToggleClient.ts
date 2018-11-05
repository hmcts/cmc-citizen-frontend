import { request } from 'integration-test/helpers/clients/base/request'

const baseURL: string = process.env.FEATURE_TOGGLES_API_URL
const featureTogglesApiUrl: string = `${baseURL}/api/ff4j/check`

export class FeatureTogglesClient {

  static isAdmissionsAllowed (user: User, roles: string[]): Promise<boolean> {
    if (!user) {
      return Promise.reject(new Error('user must be set'))
    }

    return request.get(`${featureTogglesApiUrl}/cmc_admissions`, {
      headers: {
        'X-USER-ID': `${user.email}`,
        'X-USER-PERMISSIONS': roles.join(',')
      }
    })
  }
}
