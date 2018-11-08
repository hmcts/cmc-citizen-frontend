/* tslint:disable:no-console */
import { request } from 'integration-test/helpers/clients/base/request'
import * as fs from 'fs'

const baseUrl = process.env.CITIZEN_APP_URL

export class AppClient {

  /**
   * Retrieves claim from the claim store by claim reference number
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
        console.log(response)
        return response.extraBuildInfo.featureToggles.admissions
      })
  }

}
