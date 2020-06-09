"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const featuresBuilder_1 = require("claim/helpers/featuresBuilder");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const user_1 = require("idam/user");
const hooks_1 = require("test/routes/hooks");
const app_1 = require("main/app");
const launchDarklyClient_1 = require("shared/clients/launchDarklyClient");
const claimStoreClient_1 = require("claims/claimStoreClient");
const ts_mockito_1 = require("ts-mockito");
const mockLaunchDarklyClient = ts_mockito_1.mock(launchDarklyClient_1.LaunchDarklyClient);
const featuresBuilder = new featuresBuilder_1.FeaturesBuilder(new claimStoreClient_1.ClaimStoreClient(), ts_mockito_1.instance(mockLaunchDarklyClient));
const user = new user_1.User('1', 'user@example.com', 'John', 'Smith', ['cmc-new-features-consent-given'], 'citizen', '');
const MIN_THRESHOLD = Math.min(featuresBuilder_1.FeaturesBuilder.JUDGE_PILOT_THRESHOLD, featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD, featuresBuilder_1.FeaturesBuilder.MEDIATION_PILOT_AMOUNT, featuresBuilder_1.FeaturesBuilder.ONLINE_DQ_THRESHOLD);
function enableFeatures(...features) {
    featuresBuilder_1.FEATURES.map(feature => feature.toggle)
        .forEach(toggle => ts_mockito_1.when(mockLaunchDarklyClient.variation(ts_mockito_1.anything(), ts_mockito_1.anything(), toggle, ts_mockito_1.anything()))
        .thenResolve(Promise.resolve(features.indexOf(toggle) >= 0)));
}
describe('FeaturesBuilder', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    beforeEach(() => {
        claimStoreServiceMock.resolveRetrieveUserRoles(user.roles[0]);
    });
    afterEach(() => {
        ts_mockito_1.reset(mockLaunchDarklyClient);
    });
    describe('Admissions Feature', () => {
        it('should add admissions to features if flag is set', async () => {
            enableFeatures('admissions');
            const features = await featuresBuilder.features(1, user);
            chai_1.expect(features).to.equal('admissions');
        });
    });
    describe('Directions Questionnaire Feature', () => {
        it(`should add dq to features if flag is set and amount <= ${featuresBuilder_1.FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
            enableFeatures('directions_questionnaire');
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.ONLINE_DQ_THRESHOLD, user);
            chai_1.expect(features).to.equal('directionsQuestionnaire');
        });
        it(`should not add dq to features if amount > ${featuresBuilder_1.FeaturesBuilder.ONLINE_DQ_THRESHOLD}`, async () => {
            const featuresBuilder = new featuresBuilder_1.FeaturesBuilder(new claimStoreClient_1.ClaimStoreClient(), ts_mockito_1.instance(mockLaunchDarklyClient));
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.ONLINE_DQ_THRESHOLD + 0.01, user);
            chai_1.expect(features).to.be.undefined;
        });
    });
    describe('Mediation Pilot Feature', () => {
        it(`should add mediation pilot to features if amount <= ${featuresBuilder_1.FeaturesBuilder.MEDIATION_PILOT_AMOUNT} and flag is set`, async () => {
            enableFeatures('mediation_pilot');
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.MEDIATION_PILOT_AMOUNT, user);
            chai_1.expect(features).to.equal('mediationPilot');
        });
        it(`should not add mediation pilot to features if amount > ${featuresBuilder_1.FeaturesBuilder.MEDIATION_PILOT_AMOUNT}`, async () => {
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.MEDIATION_PILOT_AMOUNT + 0.01, user);
            chai_1.expect(features).to.be.undefined;
        });
    });
    describe('Legal advisor Pilot Feature', () => {
        it(`should add legal advisor eligible to features if amount <= ${featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD} and flag is set`, async () => {
            enableFeatures('legal_advisor_pilot');
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD, user);
            chai_1.expect(features).to.equal('LAPilotEligible');
        });
        it(`should not add legal advisor eligible to features if amount > ${featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD}`, async () => {
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD, user);
            chai_1.expect(features).to.be.undefined;
        });
    });
    describe('Judge Pilot Feature', () => {
        it(`should add judge pilot eligible to features if amount <= ${featuresBuilder_1.FeaturesBuilder.JUDGE_PILOT_THRESHOLD} and flag is set`, async () => {
            enableFeatures('judge_pilot');
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user);
            chai_1.expect(features).to.equal('judgePilotEligible');
        });
        it(`should not add judge pilot eligible to features if amount > ${featuresBuilder_1.FeaturesBuilder.JUDGE_PILOT_THRESHOLD}`, async () => {
            const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.JUDGE_PILOT_THRESHOLD, user);
            chai_1.expect(features).to.be.undefined;
        });
    });
    it(`should add legal advisor, dqOnline and mediation pilot to features if principal amount <= ${MIN_THRESHOLD} and flags are set`, async () => {
        enableFeatures('legal_advisor_pilot', 'directions_questionnaire', 'mediation_pilot');
        const features = await featuresBuilder.features(MIN_THRESHOLD, user);
        chai_1.expect(features).to.equal('mediationPilot, LAPilotEligible, directionsQuestionnaire');
    });
    it(`should not add judge pilot if legal advisor pilot is eligible`, async () => {
        enableFeatures('legal_advisor_pilot', 'judge_pilot');
        const features = await featuresBuilder.features(featuresBuilder_1.FeaturesBuilder.LA_PILOT_THRESHOLD, user);
        chai_1.expect(features).to.equal('LAPilotEligible');
    });
    describe('Service Slow Feature', () => {
        it('should show service slow banner if flag is set', async () => {
            enableFeatures('service_slow_banner');
            const features = await featuresBuilder.features(1, user);
            chai_1.expect(features).to.equal('service_slow_banner');
        });
    });
});
