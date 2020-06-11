"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
class FeaturesBuilder {
    constructor(claimStoreClient, launchDarklyClient) {
        this.claimStoreClient = claimStoreClient;
        this.launchDarklyClient = launchDarklyClient;
    }
    async features(amount, user) {
        const roles = await this.claimStoreClient.retrieveUserRoles(user);
        if (!roles.includes('cmc-new-features-consent-given')) {
            // all features require consent
            return undefined;
        }
        let features = [];
        for (const feature of exports.FEATURES) {
            if (feature.validForAmount(amount)) {
                const offlineDefault = config.get(`featureToggles.${feature.setting}`) || false;
                const ldVariation = await this.launchDarklyClient.variation(user, roles, feature.toggle, offlineDefault);
                if (ldVariation) {
                    features.push(feature.feature);
                }
            }
        }
        return (!features || features.length === 0) ? undefined : features.join(', ');
    }
}
exports.FeaturesBuilder = FeaturesBuilder;
FeaturesBuilder.MEDIATION_PILOT_AMOUNT = 500;
FeaturesBuilder.LA_PILOT_THRESHOLD = 300;
FeaturesBuilder.JUDGE_PILOT_THRESHOLD = 10000;
FeaturesBuilder.ONLINE_DQ_THRESHOLD = 10000;
exports.FEATURES = [
    {
        feature: 'admissions',
        toggle: 'admissions',
        setting: 'admissions',
        validForAmount: () => true
    },
    {
        feature: 'mediationPilot',
        toggle: 'mediation_pilot',
        setting: 'mediationPilot',
        validForAmount: amount => amount <= FeaturesBuilder.MEDIATION_PILOT_AMOUNT
    },
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
];
