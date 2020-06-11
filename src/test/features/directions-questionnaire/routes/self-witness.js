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
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const yesNoOption_1 = require("models/yesNoOption");
const featureToggles_1 = require("utils/featureToggles");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const claimWithDQ = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { features: ['directionsQuestionnaire'] });
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const otherWitnessesPage = paths_1.Paths.otherWitnessesPage.evaluateUri({ externalId: externalId });
const pagePath = paths_1.Paths.selfWitnessPage.evaluateUri({ externalId: externalId });
function checkAccessGuard(app, method) {
    it(`should redirect to dashboard page when DQ is not enabled for claim`, async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
    });
}
describe('Directions Questionnaire - self witness page', () => {
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
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Do you want to give evidence?'));
                });
            });
        });
        describe('on POST', () => {
            const validFormData = { option: yesNoOption_1.YesNoOption.YES.option };
            const invalidFormData = { option: undefined };
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
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 when cannot retrieve DQ draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
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
                    it('should redirect to other witnesses page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(otherWitnessesPage));
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
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Do you want to give evidence?', 'div class="error-summary"'));
                    });
                });
            });
        });
    }
});
