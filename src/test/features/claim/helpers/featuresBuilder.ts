/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FEATURES, FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { User } from 'idam/user'
import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { anything, instance, mock, reset, when } from 'ts-mockito'
import { FeatureToggles } from 'utils/featureToggles'
import * as sinon from 'sinon'

const mockLaunchDarklyClient: LaunchDarklyClient = mock(LaunchDarklyClient)
const featuresBuilder = new FeaturesBuilder(new ClaimStoreClient(), instance(mockLaunchDarklyClient))

const user = new User('1', 'user@example.com', 'John', 'Smith', ['cmc-new-features-consent-given'], 'citizen', '')

const MIN_THRESHOLD = Math.min(
  FeaturesBuilder.JUDGE_PILOT_THRESHOLD,
  FeaturesBuilder.LA_PILOT_THRESHOLD,
  FeaturesBuilder.MEDIATION_PILOT_AMOUNT,
  FeaturesBuilder.ONLINE_DQ_THRESHOLD
)

function enableFeatures (...features: string[]) {
  FEATURES.map(feature => feature.toggle)
    .forEach(toggle => when(mockLaunchDarklyClient.userVariation(anything(), anything(), toggle, anything()))
      .thenResolve(Promise.resolve(features.indexOf(toggle) >= 0)))
}

describe('FeaturesBuilder', () => {
  attachDefaultHooks(app)
  let isAutoEnrollIntoNewFeatureEnabledStub: sinon.SinonStub

  beforeEach(() => {
    claimStoreServiceMock.resolveRetrieveUserRoles(user.roles[0])
    isAutoEnrollIntoNewFeatureEnabledStub = sinon.stub(FeatureToggles.prototype, 'isAutoEnrollIntoNewFeatureEnabled')
  })

  afterEach(() => {
    reset(mockLaunchDarklyClient)
    isAutoEnrollIntoNewFeatureEnabledStub.restore()
  })

  describe('Directions Questionnaire Feature', () => {
    it(`should add dq to features if flag is set and amount <= ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      enableFeatures('directions_questionnaire')
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD, user)
      expect(features).to.equal('directionsQuestionnaire')
    })

    it(`should not add dq to features if amount > ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      const featuresBuilder = new FeaturesBuilder(new ClaimStoreClient(), instance(mockLaunchDarklyClient))
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD + 0.01, user)
      expect(features).to.be.undefined
    })

  })

  describe('Mediation Pilot Feature', () => {
    it(`should add mediation pilot to features if amount <= ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT} and flag is set`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      enableFeatures('mediation_pilot')
      const features = await featuresBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT, user)
      expect(features).to.equal('mediationPilot')
    })

    it(`should not add mediation pilot to features if amount > ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT}`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      const features = await featuresBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT + 0.01, user)
      expect(features).to.be.undefined
    })
  })

  describe('Legal advisor Pilot Feature', () => {
    it(`should add legal advisor eligible to features if amount <= ${FeaturesBuilder.LA_PILOT_THRESHOLD} and flag is set`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      enableFeatures('legal_advisor_pilot')
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.equal('LAPilotEligible')
    })

    it(`should not add legal advisor eligible to features if amount > ${FeaturesBuilder.LA_PILOT_THRESHOLD}`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  describe('Judge Pilot Feature', () => {
    it(`should add judge pilot eligible to features if amount <= ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD} and flag is set`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      enableFeatures('judge_pilot')
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.equal('judgePilotEligible')
    })

    it(`should not add judge pilot eligible to features if amount > ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD}`, async () => {
      isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  it(`should not add judge pilot if legal advisor pilot is eligible`, async () => {
    isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
    enableFeatures('legal_advisor_pilot', 'judge_pilot')
    const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
    expect(features).to.equal('LAPilotEligible')
  })
})

describe('Auto Enroll into new feature scenario', () => {
  attachDefaultHooks(app)
  let isAutoEnrollIntoNewFeatureEnabledStub: sinon.SinonStub

  beforeEach(() => {
    isAutoEnrollIntoNewFeatureEnabledStub = sinon.stub(FeatureToggles.prototype, 'isAutoEnrollIntoNewFeatureEnabled')
  })

  afterEach(() => {
    isAutoEnrollIntoNewFeatureEnabledStub.restore()
  })

  it(`should return undefined when auto enroll toggle is set to true and roles do not contain consent given`, async () => {
    claimStoreServiceMock.resolveRetrieveUserRoles('not-a-consent-role')
    isAutoEnrollIntoNewFeatureEnabledStub.returns(true)
    enableFeatures('legal_advisor_pilot', 'directions_questionnaire', 'mediation_pilot')
    const features = await featuresBuilder.features(MIN_THRESHOLD, user)
    expect(features).to.equal('mediationPilot, LAPilotEligible, directionsQuestionnaire')
  })
})
