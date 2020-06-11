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
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const madeBy_1 = require("claims/models/madeBy");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.redeterminationPage.evaluateUri({ externalId: externalId, madeBy: madeBy_1.MadeBy.CLAIMANT.value });
const confirmationPage = paths_1.Paths.redeterminationConfirmationPage.evaluateUri({ externalId: externalId });
const validFormData = {
    text: 'I feel Defendant can pay earlier and I need money sooner'
};
describe('CCJ - re-determination page', () => {
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
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                    respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                    countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
                    countyCourtJudgment: {
                        defendantDateOfBirth: '1990-11-01',
                        paidAmount: 2,
                        paymentOption: 'INSTALMENTS',
                        repaymentPlan: {
                            instalmentAmount: 30,
                            firstPaymentDate: '2018-11-11',
                            paymentSchedule: 'EVERY_MONTH',
                            completionDate: '2019-11-11',
                            paymentLength: '12 months'
                        },
                        ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
                    },
                    claimantResponse: {
                        type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                        amountPaid: 0
                    }
                });
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Why do you believe the defendant can repay you sooner?'));
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
                });
                context('when form is valid', async () => {
                    beforeEach(() => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                            respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                            countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
                            countyCourtJudgment: {
                                defendantDateOfBirth: '1990-11-01',
                                paidAmount: 2,
                                paymentOption: 'INSTALMENTS',
                                repaymentPlan: {
                                    instalmentAmount: 30,
                                    firstPaymentDate: '2018-11-11',
                                    paymentSchedule: 'EVERY_MONTH',
                                    completionDate: '2019-11-11',
                                    paymentLength: '12 months'
                                },
                                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
                            },
                            claimantResponse: {
                                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                                amountPaid: 0
                            }
                        });
                    });
                    it('should redirect to redetermination confirmation page', async () => {
                        claimStoreServiceMock.resolveSaveReDeterminationForExternalId(validFormData.text);
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(confirmationPage));
                    });
                    it('should return 500 and render error page when cannot save determination', async () => {
                        claimStoreServiceMock.rejectSaveReDeterminationForExternalId();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(validFormData)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is invalid', async () => {
                    it('should render page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                            respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                            countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
                            countyCourtJudgment: {
                                defendantDateOfBirth: '1990-11-01',
                                paidAmount: 2,
                                paymentOption: 'INSTALMENTS',
                                repaymentPlan: {
                                    instalmentAmount: 30,
                                    firstPaymentDate: '2018-11-11',
                                    paymentSchedule: 'EVERY_MONTH',
                                    completionDate: '2019-11-11',
                                    paymentLength: '12 months'
                                },
                                ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
                            },
                            claimantResponse: {
                                type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
                                amountPaid: 0
                            }
                        });
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: undefined })
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid reason', 'div class="error-summary"'));
                    });
                });
            });
        });
    });
});
