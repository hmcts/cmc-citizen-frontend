"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const app_1 = require("main/app");
const config = require("config");
const request = require("supertest");
const paths_1 = require("directions-questionnaire/paths");
const paths_2 = require("dashboard/paths");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/routes/authorization-check");
const dqRouteHelper_1 = require("./helper/dqRouteHelper");
const party_type_1 = require("integration-test/data/party-type");
const madeBy_1 = require("claims/models/madeBy");
const localDateUtils_1 = require("test/localDateUtils");
const featureToggles_1 = require("utils/featureToggles");
const claimWithDQ = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { features: ['directionsQuestionnaire'] });
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const claim = dqRouteHelper_1.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.CLAIMANT);
const cookieName = config.get('session.cookieName');
const hearingDatesPath = paths_1.Paths.hearingDatesPage.evaluateUri({ externalId: externalId });
const unavailableDates = [
    localDateUtils_1.daysFromNow(1),
    localDateUtils_1.daysFromNow(10),
    localDateUtils_1.daysFromNow(100)
];
function checkAccessGuard(app, method, path) {
    it('should redirect to dashboard page when DQ is not enabled for claim', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
        await request(app)[method](path)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
    });
}
if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
    describe('Directions Questionnaire - hearing dates picker widget', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('delete a date', () => {
            const deletePath = paths_1.Paths.hearingDatesDeleteReceiver.evaluateUri({ externalId: externalId, index: 'date-1' });
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, deletePath);
            checkAccessGuard(app_1.app, method, deletePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                it('should redirect to the hearing dates page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire', {
                        availability: {
                            hasUnavailableDates: true,
                            unavailableDates: unavailableDates
                        }
                    });
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .get(deletePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(hearingDatesPath));
                });
            });
        });
        describe('replace selected dates', () => {
            const replacePath = paths_1.Paths.hearingDatesReplaceReceiver.evaluateUri({ externalId: externalId });
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, replacePath);
            checkAccessGuard(app_1.app, method, replacePath);
            context('when user authorised', () => {
                const validData = { hasUnavailableDates: true, unavailableDates: unavailableDates };
                const invalidData = { hasUnavailableDates: true, unavailableDates: [{ year: 2000, month: 0, day: 2 }] };
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                context('when form is valid', () => {
                    it('should return the formatted data', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(replacePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validData)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('add-another-delete-link-0', 'add-another-delete-link-1', 'add-another-delete-link-2'))
                            .expect(res => chai_1.expect(res).to.be.successful.withoutText('add-another-delete-link-3'));
                    });
                });
                context('when form is invalid', () => {
                    it('should return HTTP 400', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        await request(app_1.app)
                            .post(replacePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(invalidData)
                            .expect(res => chai_1.expect(res).to.be.badRequest);
                    });
                });
            });
        });
    });
}
