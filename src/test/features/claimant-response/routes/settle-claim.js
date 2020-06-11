"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const app_1 = require("main/app");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const responseData = require("test/data/entity/responseData");
const paths_1 = require("claimant-response/paths");
const authorization_check_1 = require("./checks/authorization-check");
const not_claimant_in_case_check_1 = require("./checks/not-claimant-in-case-check");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const freeMediation_1 = require("forms/models/freeMediation");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.settleClaimPage.evaluateUri({ externalId: externalId });
const equalToClaimAmountDefendantResponseClaim = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { totalAmountTillDateOfIssue: responseData.partialAdmissionAlreadyPaidData.amount, response: responseData.partialAdmissionAlreadyPaidData });
const lessThanClaimAmountDefendantResponseClaim = Object.assign(Object.assign({}, equalToClaimAmountDefendantResponseClaim), { totalAmountTillDateOfIssue: equalToClaimAmountDefendantResponseClaim.response.amount + 10 });
describe('Claimant Response: part payment received page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render with "Do you agree" text if payment is equal to claim amount', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(equalToClaimAmountDefendantResponseClaim);
                    draftStoreServiceMock.resolveFind('claimantResponse', {
                        freeMediation: {
                            option: freeMediation_1.FreeMediationOption.NO
                        }
                    });
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Do you agree the defendant has paid'));
                });
                it('should render with "Do you want to settle" text if payment is less than claim amount', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim);
                    draftStoreServiceMock.resolveFind('claimantResponse', {
                        freeMediation: {
                            option: freeMediation_1.FreeMediationOption.NO
                        }
                    });
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Do you want to settle the claim'));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when form is invalid', () => {
                it('should render page with error summary when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claimantResponse', {});
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Do you agree the defendant has paid', 'div class="error-summary"'));
                });
            });
            context('when form is valid', () => {
                beforeEach(() => {
                    draftStoreServiceMock.resolveFind('claimantResponse', {});
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(lessThanClaimAmountDefendantResponseClaim);
                    draftStoreServiceMock.resolveUpdate();
                });
                it('should redirect to the task list page when yes is selected', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ accepted: 'yes' })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId })));
                });
                it('should redirect to the reject reason page when no is selected', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ accepted: 'no' })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.rejectionReasonPage.evaluateUri({ externalId: externalId })));
                });
            });
        });
    });
});
