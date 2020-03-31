/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import * as config from 'config'
import { User } from 'idam/user'
import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'

function mockFeatureFlag (feature: string, enabled: boolean): mock.Scope {
  return mock(`${config.get<string>('feature-toggles-api.url')}/api/ff4j/check`)
    .get(`/${feature}`)
    .reply(HttpStatus.OK, enabled ? { some: 'value' } : null)
}

const user = new User('1', 'user@example.com', 'John', 'Smith', [], 'citizen', '')

const MIN_THRESHOLD = Math.min(
  FeaturesBuilder.JUDGE_PILOT_THRESHOLD,
  FeaturesBuilder.LA_PILOT_THRESHOLD,
  FeaturesBuilder.MEDIATION_PILOT_AMOUNT,
  FeaturesBuilder.ONLINE_DQ_THRESHOLD
)

describe('FeaturesBuilder', () => {
  attachDefaultHooks(app)

  beforeEach(() => {
    claimStoreServiceMock.resolveRetrieveUserRoles()
  })

  describe('Admissions Feature', () => {
    it('should add admissions to features if flag is set', async () => {
      mockFeatureFlag('cmc_admissions', true)
      const features = await FeaturesBuilder.features(1, user)
      expect(features).to.equal('admissions')
    })
  })

  describe('Directions Questionnaire Feature', () => {
    it(`should add dq to features if flag is set and amount <= ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      mockFeatureFlag('cmc_directions_questionnaire', true)
      const features = await FeaturesBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD, user)
      expect(features).to.equal('directionsQuestionnaire')
    })

    it(`should not dd dq to features if amount > ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      const features = await FeaturesBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD + 0.01, user)
      expect(features).to.be.undefined
    })

  })

  describe('Mediation Pilot Feature', () => {
    it(`should add mediation pilot to features if amount <= ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT} and flag is set`, async () => {
      mockFeatureFlag('cmc_mediation_pilot', true)
      const features = await FeaturesBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT, user)
      expect(features).to.equal('mediationPilot')
    })

    it(`should not add mediation pilot to features if amount > ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT}`, async () => {
      const features = await FeaturesBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT + 0.01, user)
      expect(features).to.be.undefined
    })
  })

  describe('Legal advisor Pilot Feature', () => {
    it(`should add legal advisor eligible to features if amount <= ${FeaturesBuilder.LA_PILOT_THRESHOLD} and flag is set`, async () => {
      mockFeatureFlag('cmc_legal_advisor', true)
      const features = await FeaturesBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.equal('LAPilotEligible')
    })

    it(`should not add legal advisor eligible to features if amount > ${FeaturesBuilder.LA_PILOT_THRESHOLD}`, async () => {
      const features = await FeaturesBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  describe('Judge Pilot Feature', () => {
    it(`should add judge pilot eligible to features if amount <= ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD} and flag is set`, async () => {
      mockFeatureFlag('cmc_judge_pilot', true)
      const features = await FeaturesBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.equal('judgePilotEligible')
    })

    it(`should not add judge pilot eligible to features if amount > ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD}`, async () => {
      const features = await FeaturesBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  it(`should add legal advisor, dqOnline and mediation pilot to features if principal amount <= ${MIN_THRESHOLD} and flags are set`, async () => {
    mockFeatureFlag('cmc_directions_questionnaire', true)
    mockFeatureFlag('cmc_legal_advisor', true)
    mockFeatureFlag('cmc_mediation_pilot', true)
    const features = await FeaturesBuilder.features(MIN_THRESHOLD, user)
    expect(features).to.equal('mediationPilot, LAPilotEligible, directionsQuestionnaire')
  })
})
