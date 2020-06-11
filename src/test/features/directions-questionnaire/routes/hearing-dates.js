"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config = require("config");
const request = require("supertest");
const app_1 = require("main/app");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/routes/authorization-check");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const dqRouteHelper_1 = require("./helper/dqRouteHelper");
const paths_1 = require("directions-questionnaire/paths");
const paths_2 = require("response/paths");
const paths_3 = require("dashboard/paths");
const party_type_1 = require("integration-test/data/party-type");
const madeBy_1 = require("claims/models/madeBy");
const localDateUtils_1 = require("test/localDateUtils");
const featureToggles_1 = require("utils/featureToggles");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const claimWithDQ = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { features: ['directionsQuestionnaire'] });
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const claim = dqRouteHelper_1.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.CLAIMANT);
const pagePath = paths_1.Paths.hearingDatesPage.evaluateUri({ externalId: externalId });
const defendantTaskListPage = paths_2.Paths.taskListPage.evaluateUri({ externalId: externalId });
const cookieName = config.get('session.cookieName');
function checkAccessGuard(app, method) {
    it('should redirect to dashboard page when DQ is not enabled for claim', async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_3.Paths.dashboardPage.uri));
    });
}
describe('Directions Questionnaire - hearing unavailable dates', () => {
    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            checkAccessGuard(app_1.app, method);
            context('when defendant authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            });
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                it('should return 500 and render error page when cannot retrieve claims', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve directions questionnaire draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                context('when everything is fine', () => {
                    it('should render page without pre-selected dates', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing', 'No dates added yet'));
                    });
                    it('should render page with pre-selected dates', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire', {
                            availability: {
                                hasUnavailableDates: true,
                                unavailableDates: [{ year: 2018, month: 1, day: 1 }, { year: 2018, month: 1, day: 5 }]
                            }
                        });
                        draftStoreServiceMock.resolveFind('response');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('1 January 2018', '5 January 2018'));
                    });
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            checkAccessGuard(app_1.app, method);
            context('when defendant authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            });
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('123', 'citizen');
                });
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 when cannot retrieve DQ draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                context('with the JavaScript-enabled API', () => {
                    const validFormData = { hasUnavailableDates: true, unavailableDates: [localDateUtils_1.daysFromNow(1)] };
                    const invalidFormData = { hasUnavailableDates: true, unavailableDates: [] };
                    context('when form is valid', async () => {
                        it('should return 500 and render error page when cannot save DQ draft', async () => {
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.rejectUpdate();
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormData)
                                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                        });
                        it('should redirect to task list page', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormData)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(defendantTaskListPage));
                        });
                    });
                    context('when form is invalid', async () => {
                        it('should render page when everything is fine', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(invalidFormData)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing', 'div class="error-summary"'));
                        });
                    });
                });
                context('with the JavaScript-disabled API', () => {
                    const validFormData = { addDate: 'Add', hasUnavailableDates: true, newDate: localDateUtils_1.daysFromNow(1) };
                    const invalidFormDataWithYes = {
                        noJS: true,
                        addDate: 'Add',
                        hasUnavailableDates: true,
                        newDate: { year: 2000, month: 2, day: 30 }
                    };
                    const invalidFormDataWithNo = {
                        noJS: true,
                        hasUnavailableDates: false,
                        unavailableDates: [localDateUtils_1.daysFromNow(1)]
                    };
                    context('when form is valid', () => {
                        it('should return 500 and render error page when cannot save DQ draft', async () => {
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.rejectUpdate();
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormData)
                                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                        });
                        it('should return to the same page', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormData)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing'));
                        });
                    });
                    context('when form is invalid', () => {
                        [invalidFormDataWithNo, invalidFormDataWithYes].forEach(invalidFormData => {
                            it(`should render page when everything is fine and has dates ${invalidFormData.hasUnavailableDates ? '' : 'not '}selected`, async () => {
                                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                                draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                                draftStoreServiceMock.resolveFind('response');
                                await request(app_1.app)
                                    .post(pagePath)
                                    .set('Cookie', `${cookieName}=ABC`)
                                    .send(invalidFormData)
                                    .expect(res => chai_1.expect(res).to.be.successful.withText('Select the dates you can’t go to a hearing', 'div class="error-summary"'));
                            });
                        });
                    });
                });
            });
        });
    }
});
