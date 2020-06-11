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
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.paymentDatePage.evaluateUri({ externalId: externalId });
const heading = 'When do you want the defendant to pay?';
const claimantResponseDraftOverrideWithDisposableIncome = {
    alternatePaymentMethod: {
        paymentOption: {
            option: {
                value: paymentOption_1.PaymentType.BY_SET_DATE.value
            }
        }
    },
    courtDetermination: { disposableIncome: 1000 }
};
const claimantResponseDraftOverrideWithNoDisposableIncome = {
    alternatePaymentMethod: {
        paymentOption: {
            option: {
                value: paymentOption_1.PaymentType.BY_SET_DATE.value
            }
        }
    },
    courtDetermination: { disposableIncome: -100 }
};
describe('Claimant response: payment date', () => {
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
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                    draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome);
                });
                it(`should render page with heading '${heading}'`, async () => {
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(heading));
                });
                it('should show the claimant response notice', async () => {
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('The court will review your suggestion and may reject it if it’s sooner than the defendant can afford to repay the money.'));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        const validFormData = {
            date: {
                year: 2050,
                month: 12,
                day: 31
            }
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
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot save draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                    draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome);
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when service is healthy', () => {
                const dataToSend = {
                    date: localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().add(10, 'years'))
                };
                context('when form is valid', async () => {
                    it('should redirect to repayment plan accepted page when court decision is CLAIMANT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend)
                            .expect(res => chai_1.expect(res).to.redirect.toLocation(paths_1.Paths.payBySetDateAcceptedPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered set date page when court decision is COURT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend)
                            .expect(res => chai_1.expect(res).to.redirect.toLocation(paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to court offered instalments page when court decision is COURT', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                        draftStoreServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend)
                            .expect(res => chai_1.expect(res).to.redirect.toLocation(paths_1.Paths.courtOfferedInstalmentsPage.evaluateUri({ externalId: externalId })));
                    });
                    it('should redirect to task list page when Defendant is business', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData);
                        draftStoreServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithNoDisposableIncome);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(dataToSend)
                            .expect(res => chai_1.expect(res).to.redirect.toLocation(paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId })));
                    });
                });
                context('when form is invalid', async () => {
                    it(`should render page with heading '${heading}'`, async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentBySetDateResponseObj);
                        draftStoreServiceMock.resolveFind('claimantResponse', claimantResponseDraftOverrideWithDisposableIncome);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({})
                            .expect(res => chai_1.expect(res).to.be.successful.withText(heading, 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
