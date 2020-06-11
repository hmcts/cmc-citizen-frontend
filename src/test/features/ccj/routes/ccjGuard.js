"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hooks_1 = require("test/routes/hooks");
const idamServiceMock = require("test/http-mocks/idam");
require("test/routes/expectations");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const request = require("supertest");
const app_1 = require("main/app");
const paths_1 = require("ccj/paths");
const paths_2 = require("dashboard/paths");
const config = require("config");
const chai_1 = require("chai");
const momentFactory_1 = require("shared/momentFactory");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const madeBy_1 = require("claims/models/madeBy");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const cookieName = config.get('session.cookieName');
const ccjWithDeterminationType = {
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
};
describe('CCJ guard', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            const excludedPaths = [paths_1.Paths.ccjConfirmationPage, paths_1.Paths.redeterminationConfirmationPage, paths_1.Paths.redeterminationPage, paths_1.Paths.repaymentPlanSummaryPage];
            context('should redirect to dashboard when claim not eligible for CCJ', () => {
                const override = {
                    respondedAt: momentFactory_1.MomentFactory.currentDateTime()
                };
                Object.values(paths_1.Paths)
                    .filter(path => !excludedPaths.includes(path))
                    .forEach((path) => {
                    const route = path.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' });
                    it(`for ${route} route`, async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(override);
                        await request(app_1.app)
                            .get(route)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
                    });
                });
            });
            context('should redirect to dashboard when claim not eligible for CCJ - CCJ already requested', () => {
                const override = {
                    countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.currentDateTime()
                };
                Object.values(paths_1.Paths)
                    .filter(path => !excludedPaths.includes(path))
                    .forEach((path) => {
                    const route = path.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' });
                    it(`for ${route} route`, async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(override);
                        await request(app_1.app)
                            .get(route)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dashboardPage.uri));
                    });
                });
            });
            it('should NOT redirect to dashboard when claim not eligible for CCJ on confirmation page', async () => {
                const route = paths_1.Paths.ccjConfirmationPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' });
                claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                    respondedAt: momentFactory_1.MomentFactory.currentDateTime(),
                    countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785'
                });
                await request(app_1.app)
                    .get(route)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('County Court Judgment requested'));
            });
            it('should NOT redirect to dashboard when claim not eligible for CCJ on re determination page', async () => {
                const route = paths_1.Paths.redeterminationPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8', madeBy: madeBy_1.MadeBy.CLAIMANT.value });
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(ccjWithDeterminationType);
                await request(app_1.app)
                    .get(route)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Why do you believe the defendant can repay you sooner'));
            });
            it('should NOT redirect to dashboard when claim not eligible for CCJ on repayment plan summary page', async () => {
                const route = paths_1.Paths.repaymentPlanSummaryPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8', madeBy: madeBy_1.MadeBy.CLAIMANT.value });
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(ccjWithDeterminationType);
                await request(app_1.app)
                    .get(route)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('The repayment plan'));
            });
        });
    });
});
