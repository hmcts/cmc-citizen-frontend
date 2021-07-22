export class FeaturesBuilder {
  static readonly LA_PILOT_THRESHOLD = 300
  static readonly JUDGE_PILOT_THRESHOLD = 10000
  static readonly ONLINE_DQ_THRESHOLD = 10000

  async features (amount: number): Promise<string> {

    let features = []
    for (const feature of FEATURES) {
      if (feature.validForAmount(amount)) {
        features.push(feature.feature)
      }
    }
    return (!features || features.length === 0) ? undefined : features.join(', ')
  }
}

type FeatureDefinition = {
  feature: string
  toggle: string
  setting: string
  validForAmount: (amount: number) => boolean
}

export const FEATURES: FeatureDefinition[] = [
  {
    feature: 'LAPilotEligible',
    toggle: 'legal_advisor_pilot',
    setting: 'legalAdvisorPilot',
    validForAmount: amount => amount <= FeaturesBuilder.LA_PILOT_THRESHOLD
  },
  {
    feature: 'judgePilotEligible',
    toggle: 'judge_pilot',
    setting: 'judgePilot',
    validForAmount: amount => amount > FeaturesBuilder.LA_PILOT_THRESHOLD && amount <= FeaturesBuilder.JUDGE_PILOT_THRESHOLD
  },
  {
    feature: 'directionsQuestionnaire',
    toggle: 'directions_questionnaire',
    setting: 'directionsQuestionnaire',
    validForAmount: amount => amount <= FeaturesBuilder.ONLINE_DQ_THRESHOLD
  }
]
