"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const cookieName = config.get('session.cookieName');
const expectedTextOnPage = 'Who are you making the claim against?';
describe('Claim issue: defendant party type selection page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.defendantPartyTypeSelectionPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.defendantPartyTypeSelectionPage.uri);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.defendantPartyTypeSelectionPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', paths_1.Paths.defendantPartyTypeSelectionPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page with error when form is invalid', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: undefined })
                    .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'));
            });
            it('should return 500 and render error page when form is valid and cannot save draft', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: undefined });
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: 'individual' })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should redirect to individual details page when Individual party type selected ', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: undefined });
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: 'individual' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantIndividualDetailsPage.uri));
            });
            it('should redirect to sole trader details page when soleTrader party type selected ', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: undefined });
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: 'soleTrader' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri));
            });
            it('should redirect to company details page when company party type selected ', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: undefined });
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: 'company' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantCompanyDetailsPage.uri));
            });
            it('should redirect to organization details page when organization party type selected ', async () => {
                draftStoreServiceMock.resolveFind('claim', { defendant: undefined });
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.defendantPartyTypeSelectionPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: 'organisation' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantOrganisationDetailsPage.uri));
            });
        });
    });
});
