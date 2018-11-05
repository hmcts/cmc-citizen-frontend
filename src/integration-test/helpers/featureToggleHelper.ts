import { FeatureTogglesClient } from 'integration-test/helpers/clients/featureToggleClient'

class FeatureToggleHelper extends codecept_helper {

  async isAdmissionsAllowedForCitizenWithConsentGiven (user: User): Promise<boolean> {
    return FeatureTogglesClient.isAdmissionsAllowed(user, ['cmc-new-features-consent-given'])
  }

}

// Node.js style export is required by CodeceptJS framework
module.exports = FeatureToggleHelper
