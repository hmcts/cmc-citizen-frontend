/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { User } from 'idam/user'
import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import * as ld from 'ldclient-node'

let featureAdmissions: boolean = false
let featureJudgePilot: boolean = false
let featureLAPilot: boolean = false
let featureMediationPilot: boolean = false
let featureOnlineDQs: boolean = false

const LaunchDarklyClientMock: LaunchDarklyClient = {
  async variation (user: User, roles: string[], featureKey: string): Promise<ld.LDFlagValue> {
    switch (featureKey) {
      case 'admissions': return featureAdmissions
      case 'judge_pilot': return featureJudgePilot
      case 'legal_advisor_pilot': return featureLAPilot
      case 'mediation_pilot': return featureMediationPilot
      case 'directions_questionnaire': return featureOnlineDQs
    }
  }
}

const featuresBuilder = new FeaturesBuilder(new ClaimStoreClient(), LaunchDarklyClientMock)

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

  afterEach(() => {
    featureAdmissions = false
    featureJudgePilot = false
    featureLAPilot = false
    featureMediationPilot = false
    featureOnlineDQs = false
  })

  describe('Admissions Feature', () => {
    it('should add admissions to features if flag is set', async () => {
      featureAdmissions = true
      const features = await featuresBuilder.features(1, user)
      expect(features).to.equal('admissions')
    })
  })

  describe('Directions Questionnaire Feature', () => {
    it(`should add dq to features if flag is set and amount <= ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      featureOnlineDQs = true
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD, user)
      expect(features).to.equal('directionsQuestionnaire')
    })

    it(`should not add dq to features if amount > ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD + 0.01, user)
      expect(features).to.be.undefined
    })

  })

  describe('Mediation Pilot Feature', () => {
    it(`should add mediation pilot to features if amount <= ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT} and flag is set`, async () => {
      featureMediationPilot = true
      const features = await featuresBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT, user)
      expect(features).to.equal('mediationPilot')
    })

    it(`should not add mediation pilot to features if amount > ${FeaturesBuilder.MEDIATION_PILOT_AMOUNT}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.MEDIATION_PILOT_AMOUNT + 0.01, user)
      expect(features).to.be.undefined
    })
  })

  describe('Legal advisor Pilot Feature', () => {
    it(`should add legal advisor eligible to features if amount <= ${FeaturesBuilder.LA_PILOT_THRESHOLD} and flag is set`, async () => {
      featureLAPilot = true
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.equal('LAPilotEligible')
    })

    it(`should not add legal advisor eligible to features if amount > ${FeaturesBuilder.LA_PILOT_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  describe('Judge Pilot Feature', () => {
    it(`should add judge pilot eligible to features if amount <= ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD} and flag is set`, async () => {
      featureJudgePilot = true
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.equal('judgePilotEligible')
    })

    it(`should not add judge pilot eligible to features if amount > ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user)
      expect(features).to.be.undefined
    })
  })

  it(`should add legal advisor, dqOnline and mediation pilot to features if principal amount <= ${MIN_THRESHOLD} and flags are set`, async () => {
    featureOnlineDQs = true
    featureLAPilot = true
    featureMediationPilot = true
    const features = await featuresBuilder.features(MIN_THRESHOLD, user)
    expect(features).to.equal('mediationPilot, LAPilotEligible, directionsQuestionnaire')
  })
})
