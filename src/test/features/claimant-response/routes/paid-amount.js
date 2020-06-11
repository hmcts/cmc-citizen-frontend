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
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const yesNoOption_1 = require("ccj/form/models/yesNoOption");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const claim_store_1 = require("../../../http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId });
const paidAmountSummaryPage = paths_1.CCJPaths.paidAmountSummaryPage.evaluateUri({ externalId: externalId });
const validFormData = {
    option: yesNoOption_1.PaidAmountOption.YES.value,
    amount: 10,
    claimedAmount: 100
};
const heading = 'Has the defendant paid some of the amount owed?';
describe('Claimant Response - paid amount page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
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
            it('should return 500 and render error page when cannot retrieve draft', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                draftStoreServiceMock.rejectFind('Error');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                draftStoreServiceMock.resolveFind('claimantResponse');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
                });
                context('when middleware failure', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when cannot retrieve draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.rejectFind('Error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', async () => {
                    it('should redirect to claim amount summary page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paidAmountSummaryPage));
                    });
                    it('should return 500 and render error page when cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({})
                            .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"'));
                    });
                });
                context('when provided paid amount is greater than total amount', async () => {
                    it('should render page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim_store_1.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({
                            option: yesNoOption_1.PaidAmountOption.YES.value,
                            amount: 101,
                            claimedAmount: 100
                        })
                            .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
