"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/common/checks/authorization-check");
const responseType_1 = require("response/form/models/responseType");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.FullAdmissionPaths.paymentOptionPage.evaluateUri({ externalId: externalId });
const validFormData = {
    option: paymentOption_1.PaymentType.INSTALMENTS.value
};
describe('Defendant - when will you pay options', () => {
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
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve response draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                const fullAdmissionQuestion = 'When do you want to pay?';
                it(`should render page asking '${fullAdmissionQuestion}' when full admission was selected`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission', {
                        response: {
                            type: responseType_1.ResponseType.FULL_ADMISSION
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(fullAdmissionQuestion));
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                });
                alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
                context('when service is unhealthy', () => {
                    it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot retrieve response draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.rejectFind('Error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot save response draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response:full-admission');
                        draftStoreServiceMock.resolveFind('mediation');
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
                        draftStoreServiceMock.resolveFind('response:full-admission', {
                            response: {
                                type: responseType_1.ResponseType.FULL_ADMISSION
                            }
                        });
                        draftStoreServiceMock.resolveFind('mediation');
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
                        it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.INSTALMENTS.value }, paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to payment date page for "BY_SET_DATE" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.BY_SET_DATE.value }, paths_1.FullAdmissionPaths.paymentDatePage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to task list page for "IMMEDIATELY" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.IMMEDIATELY.value }, paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId }));
                        });
                    });
                    context('when form is invalid', async () => {
                        it('should render page', async () => {
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({ name: 'John Smith' })
                                .expect(res => chai_1.expect(res).to.be.successful.withText('When do you want to pay?', 'div class="error-summary"'));
                        });
                    });
                });
            });
        });
    });
});
