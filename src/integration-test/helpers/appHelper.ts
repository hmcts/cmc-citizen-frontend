import { AppClient } from 'integration-test/helpers/clients/appClient'

class AppHelper extends codecept_helper {

  isFeatureAdmissionsEnabled (): Promise<boolean> {
    return AppClient.isFeatureAdmissionsEnabled()
  }

}

module.exports = AppHelper
