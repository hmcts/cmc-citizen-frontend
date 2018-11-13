import { request } from 'integration-test/helpers/clients/base/request'
import * as fs from 'fs'

const baseUrl = process.env.CITIZEN_APP_URL

export class AppClient {

  /**
   * Returns if 'admissions' feature toggle is enabled via /info
   *
   * @returns {Promise<boolean>}
   */
  static isFeatureAdmissionsEnabled (): Promise<boolean> {

    return request
      .get({
        uri: `${baseUrl}/info`,
        rejectUnauthorized: false,
        ca: fs.readFileSync('./src/integration-test/resources/localhost.crt')
      }).then((response: any) => {
        return response.extraBuildInfo.featureToggles.admissions
      })
  }

}
