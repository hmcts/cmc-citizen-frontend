"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.sendCompanyFinancialDetailsPage.evaluateUri({
    externalId: claimStoreServiceMock.sampleClaimObj.externalId
});
describe('Defendant company response', () => {
    describe('View send company financial details page', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
                it('should return error page when unable to retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return error page when unable to retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return successful response when claim is retrieved', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('your financial detail'));
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
            describe('for authorized user', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant');
                });
                already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
                it('should return 500 and render error page when cannot save draft', async () => {
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.rejectUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ companyDefendantResponseViewed: true })
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to task list when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ companyDefendantResponseViewed: true })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
        });
    });
});
