"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const claimant_in_case_check_1 = require("test/routes/checks/claimant-in-case-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.summaryPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: summary page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        claimant_in_case_check_1.checkOnlyClaimantHasAccess(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('Internal service error when retrieving response');
                await request(app_1.app)
                    .get(paths_1.Paths.summaryPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render not found page when claim does not have response', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(paths_1.Paths.summaryPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.notFound.withText('Page not found'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse();
                await request(app_1.app)
                    .get(paths_1.Paths.summaryPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant’s response'));
            });
        });
    });
});
