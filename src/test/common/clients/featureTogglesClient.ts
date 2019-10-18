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

// tslint:disable:disable-next-line no-unused-expression allow chai to be used without ()

describe('featureToggleClient', () => {
  context('when ff4j is available', () => {
    it('should return admission is off when feature toggle for admission is disabled', async () => {

      featureToggleApiMock.resolveIsAdmissionsAllowed(false)
      const result = await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_admissions')
      expect(result).to.be.false
    })

    it('should return admission is on when feature toggle for admission is enabled', async () => {

      featureToggleApiMock.resolveIsAdmissionsAllowed()
      const result = await featureTogglesClient.isFeatureToggleEnabled(user, roles,'cmc_admissions')
      expect(result).to.be.true
    })
  })
  context('when ff4j is not available', () => {
    it('should throw error', async () => {

      featureToggleApiMock.rejectIsAdmissionsAllowed()
      expect(await featureTogglesClient.isFeatureToggleEnabled(user, roles, 'cmc_admissions')
        .catch(err => expect(err).to.be.serverError.withText('Error')))
    })
  })
})
