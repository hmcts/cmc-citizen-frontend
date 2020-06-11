"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
require("test/routes/expectations");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.alternateRepaymentPlanPage.evaluateUri({ externalId: externalId });
const heading = 'How do you want the defendant to pay?';
describe('Claimant response: payment options', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                it(`should render page with heading '${heading}'`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse();
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
                });
            });
        });
        describe('on POST', () => {
            const method = 'post';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
            const validFormData = {
                option: paymentOption_1.PaymentType.INSTALMENTS.value
            };
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
                });
                context('when service is unhealthy', () => {
                    it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot retrieve draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.rejectFind('Error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
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
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
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
                        it('should redirect to court offer page for "IMMEDIATELY" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.IMMEDIATELY.value }, paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to payment date page for "BY_SET_DATE" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.BY_SET_DATE.value }, paths_1.Paths.paymentDatePage.evaluateUri({ externalId: externalId }));
                        });
                        it('should redirect to repayment plan page for "INSTALMENTS" option selected', async () => {
                            await checkThatSelectedPaymentOptionRedirectsToPage({ option: paymentOption_1.PaymentType.INSTALMENTS.value }, paths_1.Paths.paymentPlanPage.evaluateUri({ externalId: externalId }));
                        });
                    });
                    context('when form is invalid', async () => {
                        it(`should render page with heading '${heading}'`, async () => {
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send({})
                                .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"'));
                        });
                    });
                });
                context('When service is healthy - check all redirects are correct from payment option page', () => {
                    const dataToSend = { option: paymentOption_1.PaymentType.IMMEDIATELY.value };
                    it('should redirect to tasks list page when defendant is business', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjCompanyData);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered instalments page when court decision is COURT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } });
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: paymentOption_1.PaymentType.IMMEDIATELY.value })
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered set date page when court decision is DEFENDANT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithReasonablePaymentBySetDateResponseObjAndNoDisposableIncome);
                        draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } });
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: paymentOption_1.PaymentType.IMMEDIATELY.value })
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered instalments page when court decision is DEFENDANT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObjWithNoDisposableIncome);
                        draftStoreServiceMock.resolveFind('claimantResponse', { courtDetermination: { disposableIncome: 100 } });
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: paymentOption_1.PaymentType.IMMEDIATELY.value })
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to pay by set date accepted page when court decision is CLAIMANT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateInNext2daysResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: paymentOption_1.PaymentType.IMMEDIATELY.value })
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })));
                    });
                });
            });
        });
    });
});
