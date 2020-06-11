"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.newFeaturesConsentPage.uri;
describe('New features consent: opt-in to new features', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page when user role not present and everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveUserRoles();
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Try new features'));
            });
            it('should not render page when new feature consent role present', async () => {
                claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.uri));
            });
            it('should return 500 when role cannot be retrieved', async () => {
                claimStoreServiceMock.rejectRetrieveUserRoles();
                await request(app_1.app)
                    .get(paths_1.Paths.newFeaturesConsentPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('error'));
            });
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page with error when no selection is made', async () => {
                claimStoreServiceMock.resolveRetrieveUserRoles();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ consentResponse: undefined })
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Try new features', 'div class="error-summary"'));
            });
            it('should redirect to task list page when selection is made', async () => {
                claimStoreServiceMock.resolveRetrieveUserRoles();
                claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given');
                await request(app_1.app)
                    .post(paths_1.Paths.newFeaturesConsentPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ consentResponse: 'yes' })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.uri));
            });
            it('should return 500 when role cannot be retrieved', async () => {
                claimStoreServiceMock.rejectRetrieveUserRoles();
                await request(app_1.app)
                    .post(paths_1.Paths.newFeaturesConsentPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ consentResponse: 'yes' })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('error'));
            });
            it('should return 500 when role cannot be saved', async () => {
                claimStoreServiceMock.resolveRetrieveUserRoles();
                claimStoreServiceMock.rejectAddRolesToUser();
                await request(app_1.app)
                    .post(paths_1.Paths.newFeaturesConsentPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ consentResponse: 'yes' })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('error'));
            });
        });
    });
});
