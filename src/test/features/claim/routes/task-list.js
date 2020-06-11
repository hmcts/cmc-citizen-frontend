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
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
describe('Claim issue: task list page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.incompleteSubmissionPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.incompleteSubmissionPage.uri);
        it('should render page when everything is fine when user role present', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
            await request(app_1.app)
                .get(paths_1.Paths.taskListPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Make a money claim'));
        });
        it('should show error page when user role cannot be retrieved', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            claimStoreServiceMock.rejectRetrieveUserRoles();
            await request(app_1.app)
                .get(paths_1.Paths.taskListPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('error'));
        });
        it('should render page redirect to feature consent page when no role present', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            claimStoreServiceMock.resolveRetrieveUserRoles();
            await request(app_1.app)
                .get(paths_1.Paths.taskListPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.newFeaturesConsentPage.uri));
        });
    });
});
