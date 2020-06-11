"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.under18Page.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: under 18', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
    not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, 'get', pagePath);
    context('for authorized user', () => {
        beforeEach(() => {
            idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
        });
        it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('response');
            draftStoreServiceMock.resolveFind('mediation');
            claimStoreServiceMock.resolveRetrieveClaimByExternalId();
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Contact the court'));
        });
        alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
    });
});
