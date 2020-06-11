"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/ccj/routes/checks/authorization-check");
const paths_1 = require("ccj/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const not_claimant_in_case_check_1 = require("test/features/ccj/routes/checks/not-claimant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const madeBy_1 = require("claims/models/madeBy");
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.redeterminationConfirmationPage.evaluateUri({ externalId: externalId });
describe('CCJ: redetermination confirmation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            context('when user authorised', () => {
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
                        reDetermination: {
                            explanation: 'I feel Defendant can pay earlier and I need money sooner',
                            partyType: madeBy_1.MadeBy.CLAIMANT.value
                        },
                        reDeterminationRequestedAt: '2017-10-11T22:45:51.785'
                    });
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve asked for a judge to decide a repayment plan'));
                });
            });
        });
    });
});
