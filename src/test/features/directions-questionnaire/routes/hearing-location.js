"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("directions-questionnaire/paths");
const paths_2 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const courtFinderMock = require("test/http-mocks/court-finder-client");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const dqRouteHelper_1 = require("test/features/directions-questionnaire/routes/helper/dqRouteHelper");
const madeBy_1 = require("claims/models/madeBy");
const party_type_1 = require("integration-test/data/party-type");
const featureToggles_1 = require("utils/featureToggles");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const claim = dqRouteHelper_1.createClaim(party_type_1.PartyType.INDIVIDUAL, party_type_1.PartyType.ORGANISATION, madeBy_1.MadeBy.CLAIMANT);
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const expertPath = paths_1.Paths.expertPage.evaluateUri({ externalId: externalId });
const pagePath = paths_1.Paths.hearingLocationPage.evaluateUri({ externalId: externalId });
function checkAccessGuard(app, method) {
    it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
    });
}
describe('Directions Questionnaire - hearing location', () => {
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
                context('when court finder client is not functioning', () => {
                    it('should render fallback page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        courtFinderMock.rejectFind();
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withoutText('is the nearest to your address you gave us.'));
                    });
                });
                context('when court finder client is functioning', () => {
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        courtFinderMock.resolveFind();
                        courtFinderMock.resolveCourtDetails();
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Choose a hearing location', `${courtFinderMock.searchResponse[0].name} is the nearest to the address you gave us.`));
                    });
                });
            });
        });
        describe('on POST', () => {
            const validFormDataAccept = { courtAccepted: 'yes', courtName: 'Test court' };
            const validFormDataAcceptAlternatePostcode = {
                courtAccepted: 'no',
                alternativeOption: 'postcode',
                alternativePostcode: 'a111aa',
                courtName: 'Test court'
            };
            const validFormDataAcceptAlternateName = {
                courtAccepted: 'no',
                alternativeOption: 'name',
                alternativeCourtName: 'Test Court Name',
                courtName: 'Test court'
            };
            const invalidFormData = { courtAccepted: 'no' };
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
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormDataAccept)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 when cannot retrieve DQ draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormDataAccept)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                context('when form is valid', async () => {
                    it('should return 500 and render error page when cannot save DQ draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormDataAccept)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    context('When court is accepted', () => {
                        it('should redirect to expert page', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormDataAccept)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(expertPath));
                        });
                    });
                    context('When court is rejected', () => {
                        it('should redirect to expert page when an alternative court is suggested by name', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormDataAcceptAlternateName)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(expertPath));
                        });
                        it('should render same page with new court when an alternative court is suggested by postcode', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            courtFinderMock.resolveFind();
                            courtFinderMock.resolveCourtDetails();
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(validFormDataAcceptAlternatePostcode)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Choose a hearing location'));
                        });
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(invalidFormData)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'));
                    });
                });
                context('when submit from fallback page', () => {
                    context('when form is valid', () => {
                        it('should redirect to expert page', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            draftStoreServiceMock.resolveUpdate();
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({ alternativeCourtName: 'Test' })
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(expertPath));
                        });
                    });
                    context('when form is invalid', () => {
                        it('should render the page with errors', async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            draftStoreServiceMock.resolveFind('response');
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({ alternativeCourtName: undefined })
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Choose a hearing location', 'div class="error-summary"'));
                        });
                    });
                });
            });
        });
    }
});
