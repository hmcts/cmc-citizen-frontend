"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const paths_1 = require("testing-support/paths");
const paths_2 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/routes/authorization-check");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.createClaimDraftPage.uri;
const pageText = 'Create Claim Draft';
const draftSuccessful = paths_2.Paths.checkAndSendPage.uri;
describe('Testing Support: Create Claim Draft', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('100', 'citizen');
            });
            it('should render page when everything is fine', async () => {
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageText));
            });
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('100', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim draft', async () => {
                draftStoreServiceMock.rejectFind('HTTP Error');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot save claim draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot save user roles', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                claimStoreServiceMock.resolveRetrieveUserRoles();
                claimStoreServiceMock.rejectAddRolesToUser('error adding user role');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should redirect to check and send page and new user role is added when everything else is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                claimStoreServiceMock.resolveRetrieveUserRoles();
                claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.redirect
                    .toLocation(draftSuccessful));
            });
            it('should redirect to check and send page when user role is already added and everything else is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.redirect
                    .toLocation(draftSuccessful));
            });
            it('should redirect to check and send page and add new user role when required role is missing from list and everything else is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                claimStoreServiceMock.resolveRetrieveUserRoles('not-a-consent-role');
                claimStoreServiceMock.resolveAddRolesToUser('cmc-new-features-consent-given');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.redirect
                    .toLocation(draftSuccessful));
            });
        });
    });
});
