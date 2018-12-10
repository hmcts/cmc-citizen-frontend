import { expect } from 'chai'
import * as featureToggleApiMock from 'test/http-mocks/feature-toggle-store'
import { FeatureTogglesClient } from 'main/common/clients/featureTogglesClient'
import { User } from 'main/app/idam/user'
import * as config from 'config'
import 'test/routes/expectations'

const serviceBaseURL: string = config.get<string>('feature-toggles-api.url')
const featureTogglesClient: FeatureTogglesClient = new FeatureTogglesClient(serviceBaseURL)
const roles: string[] = []
const user: User = new User('','','','',roles,'','')

describe('featureToggleClient', () => {
  describe('when ff4j is available', () => {
    it('should return admission is off when feature toggle for admission is disabled', async () => {

      featureToggleApiMock.resolveIsAdmissionsAllowed(false)
      expect(await featureTogglesClient.isAdmissionsAllowed(user, roles)).to.be.eqls(false)
    })

    it('should return admission is on when feature toggle for admission is enabled', async () => {

      featureToggleApiMock.resolveIsAdmissionsAllowed()
      expect(await featureTogglesClient.isAdmissionsAllowed(user, roles)).to.be.eqls(true)
    })
  })
  describe('when ff4j is not available', () => {
    it('should throw error', async () => {

      featureToggleApiMock.rejectIsAdmissionsAllowed()
      expect(await featureTogglesClient.isAdmissionsAllowed(user, roles)
        .catch(err => expect(err).to.be.serverError.withText('Error')))
    })
  })
})
