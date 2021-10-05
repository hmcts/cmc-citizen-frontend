/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { FEATURES, FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import { attachDefaultHooks } from 'test/routes/hooks'
import { app } from 'main/app'

const featuresBuilder = new FeaturesBuilder()

const MIN_THRESHOLD = Math.min(
  FeaturesBuilder.JUDGE_PILOT_THRESHOLD,
  FeaturesBuilder.LA_PILOT_THRESHOLD,
  FeaturesBuilder.ONLINE_DQ_THRESHOLD
)

function enableFeatures (...features: string[]) {
  FEATURES.map(feature => feature.toggle)
}

describe('FeaturesBuilder', () => {
  attachDefaultHooks(app)

  describe('Directions Questionnaire Feature', () => {
    it(`should add dq to features if flag is set and amount <= ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD)
      expect(features).to.equal('judgePilotEligible, directionsQuestionnaire')
    })

    it(`should not add dq to features if amount > ${FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
      const featuresBuilder = new FeaturesBuilder()
      const features = await featuresBuilder.features(FeaturesBuilder.ONLINE_DQ_THRESHOLD + 0.01)
      expect(features).to.be.undefined
    })

  })

  describe('Legal advisor Pilot Feature', () => {
    it(`should add legal advisor eligible to features if amount <= ${FeaturesBuilder.LA_PILOT_THRESHOLD} and flag is set`, async () => {
      enableFeatures('legal_advisor_pilot')
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD)
      expect(features).to.equal('LAPilotEligible, directionsQuestionnaire')
    })

    it(`should not add legal advisor eligible to features if amount > ${FeaturesBuilder.LA_PILOT_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD + 1)
      expect(features).to.equal('judgePilotEligible, directionsQuestionnaire')
    })
  })

  describe('Judge Pilot Feature', () => {
    it(`should add judge pilot eligible to features if amount <= ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD} and flag is set`, async () => {
      enableFeatures('judge_pilot')
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD)
      expect(features).to.equal('judgePilotEligible, directionsQuestionnaire')
    })

    it(`should not add judge pilot eligible to features if amount > ${FeaturesBuilder.JUDGE_PILOT_THRESHOLD}`, async () => {
      const features = await featuresBuilder.features(FeaturesBuilder.JUDGE_PILOT_THRESHOLD + 1)
      expect(features).to.be.undefined
    })
  })

  it(`should add legal advisor, dqOnline and mediation pilot to features if principal amount <= ${MIN_THRESHOLD} and flags are set`, async () => {
    enableFeatures('legal_advisor_pilot', 'directions_questionnaire', 'mediation_pilot')
    const features = await featuresBuilder.features(MIN_THRESHOLD)
    expect(features).to.equal('LAPilotEligible, directionsQuestionnaire')
  })

  it(`should not add judge pilot if legal advisor pilot is eligible`, async () => {
    const features = await featuresBuilder.features(FeaturesBuilder.LA_PILOT_THRESHOLD)
    expect(features).to.equal('LAPilotEligible, directionsQuestionnaire')
  })
})
