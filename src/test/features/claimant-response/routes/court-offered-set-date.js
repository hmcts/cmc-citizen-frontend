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
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const paymentDate_1 = require("shared/components/payment-intention/model/paymentDate");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.courtOfferedSetDatePage.evaluateUri({ externalId: externalId });
const taskListPagePath = paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
const validFormData = {
    accept: 'yes'
};
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
const defendantFullAdmissionResponse = claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj;
describe('Claimant response: court offered set date page', () => {
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
                draftStoreServiceMock.resolveFind('claimantResponse', {
                    courtDetermination: {
                        decisionType: 'DEFENDANT',
                        courtDecision: {
                            paymentOption: 'BY_SPECIFIED_DATE',
                            paymentDate: momentFactory_1.MomentFactory.parse('2018-11-01'),
                            repaymentPlan: undefined
                        }
                    }
                });
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'));
            });
            it('should render page when everything is fine and COURT date is accepted', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse', {
                    courtDetermination: {
                        decisionType: 'COURT',
                        courtDecision: {
                            paymentOption: 'BY_SPECIFIED_DATE',
                            paymentDate: momentFactory_1.MomentFactory.parse('2018-11-01'),
                            repaymentPlan: undefined
                        }
                    }
                });
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'));
            });
            it('should render page when everything is fine and CLAIMANT date is accepted', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantFullAdmissionResponse);
                draftStoreServiceMock.resolveFind('claimantResponse', {
                    courtDetermination: {
                        decisionType: 'CLAIMANT',
                        courtDecision: {
                            paymentOption: 'BY_SPECIFIED_DATE',
                            paymentDate: momentFactory_1.MomentFactory.parse('2018-11-01'),
                            repaymentPlan: undefined
                        }
                    },
                    alternatePaymentMethod: {
                        paymentOption: {
                            option: {
                                value: 'BY_SPECIFIED_DATE',
                                displayValue: 'By set date'
                            }
                        },
                        paymentDate: new paymentDate_1.PaymentDate(new localDate_1.LocalDate(2018, 11, 1)),
                        paymentPlan: undefined
                    }
                });
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The defendant can’t pay by your proposed date'));
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
            context('when middleware failure', () => {
                it('should return 500 when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 when cannot retrieve claimantResponse draft', async () => {
                    draftStoreServiceMock.rejectFind('Error');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when form is valid', async () => {
                it('should redirect to task list page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind('claimantResponse');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(validFormData)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(taskListPagePath));
                });
                it('should return 500 and render error page when cannot save claimantResponse draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
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
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind('claimantResponse', {
                        courtDetermination: {
                            decisionType: 'COURT',
                            courtDecision: {
                                paymentOption: 'BY_SPECIFIED_DATE',
                                paymentDate: momentFactory_1.MomentFactory.parse('2018-11-01'),
                                repaymentPlan: undefined
                            }
                        }
                    });
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ accept: undefined })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Please select yes or no'));
                });
            });
        });
    });
});
