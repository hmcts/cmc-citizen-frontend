"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("ccj/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.paymentOptionsPage.evaluateUri({ externalId: externalId });
const validFormData = {
    option: ccjPaymentOption_1.PaymentType.IMMEDIATELY.value
};
describe('CCJ - payment options', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claims', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve CCJ draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                it('should render page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('ccj');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Payment options'));
                });
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
                context('when service is unhealthy', () => {
                    it('should return 500 when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when cannot retrieve CCJ draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.rejectFind('Error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when cannot save CCJ draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('ccj');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when service is healthy', () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('ccj');
                    });
                    context('when form is valid', async () => {
                        beforeEach(() => {
                            draftStoreServiceMock.resolveUpdate();
                        });
                        async function checkThatSelectedPaymentOptionRedirectsToPage(data, expectedToRedirect) {
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(data)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(expectedToRedirect));
                        }
                        it('should redirect to check and send page for "IMMEDIATELY" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: ccjPaymentOption_1.PaymentType.IMMEDIATELY.value }, paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: ccjPaymentOption_1.PaymentType.INSTALMENTS.value }, paths_1.Paths.repaymentPlanPage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to pay by set date page for "BY_SPECIFIED_DATE" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: ccjPaymentOption_1.PaymentType.BY_SPECIFIED_DATE.value }, paths_1.Paths.payBySetDatePage.evaluateUri({ externalId: externalId }));
                        });
                    });
                    context('when form is invalid', async () => {
                        it('should render page', async () => {
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({ name: 'John Smith' })
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Payment options', 'div class="error-summary"'));
                        });
                    });
                });
            });
        });
    });
});
