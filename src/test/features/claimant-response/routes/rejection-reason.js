"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/common/checks/authorization-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: externalId });
const taskListPagePath = paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
const rejectionReason = {
    text: 'Reason for rejection is .....'
};
describe('Claimant Response - Rejection Reason', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('when user authorised', () => {
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
            it('should return 500 and render error page when cannot retrieve claimantResponse draft', async () => {
                draftStoreServiceMock.rejectFind('Error');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Why did you reject the repayment plan'));
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 when cannot retrieve claimantResponse draft', async () => {
                draftStoreServiceMock.rejectFind('Error');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(rejectionReason)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when form is valid', () => {
                it('should redirect to task list page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(rejectionReason)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(taskListPagePath));
                });
            });
            context('when form is invalid', async () => {
                it('should render page with validation error', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ text: '' })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter why you rejected repayment plan'));
                });
            });
        });
    });
});
