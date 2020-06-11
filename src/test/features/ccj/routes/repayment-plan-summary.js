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
const responseData_1 = require("test/data/entity/responseData");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.repaymentPlanSummaryPage.evaluateUri({ externalId: externalId, madeBy: madeBy_1.MadeBy.CLAIMANT.value });
describe('CCJ - repayment plan summary page', () => {
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
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The repayment plan'));
            });
            context('When defendant response is part admission', async () => {
                it('should render correctly when repayment option is IMMEDIATELY', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithImmediatePaymentData()), { amount: 3000 }),
                        respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                        countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
                        countyCourtJudgment: {
                            defendantDateOfBirth: '1990-11-01',
                            paidAmount: 2,
                            paymentOption: 'IMMEDIATELY',
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
                        .expect(res => chai_1.expect(res).to.be.successful.withText('£2,998'));
                });
                it('should render correctly when repayment option is SET_DATE', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithImmediatePaymentData()), { amount: 3000 }),
                        respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                        countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
                        countyCourtJudgment: {
                            defendantDateOfBirth: '1990-11-01',
                            paidAmount: 0,
                            paymentOption: 'BY_SPECIFIED_DATE',
                            payBySetDate: '2018-10-10',
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
                        .expect(res => chai_1.expect(res).to.be.successful.withText('£3,000'));
                });
            });
        });
    });
});
