"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const paths_1 = require("response/paths");
const request = require("supertest");
const config = require("config");
const app_1 = require("main/app");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/routes/authorization-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const idamServiceMock = require("test/http-mocks/idam");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const chai_1 = require("chai");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.StatementOfMeansPaths.priorityDebtsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
function checkErrorHandling(method) {
    describe('errors should be handled correctly', () => {
        it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
            await request(app_1.app)[method](pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and render error page when cannot retrieve draft', async () => {
            claimStoreServiceMock.resolveRetrieveClaimByExternalId();
            draftStoreServiceMock.rejectFind('Error');
            await request(app_1.app)[method](pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
    });
}
describe('Defendant response: priority-debt', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            checkErrorHandling(method);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.resolveFind('response:full-admission');
                draftStoreServiceMock.resolveFind('mediation');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Debts you’re behind on'));
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            checkErrorHandling(method);
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            describe('validation should be triggered correctly', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                });
                it('should trigger validation when negative amount is present', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: {
                            amount: -1,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid Mortgage amount, maximum two decimal places'));
                });
                it('should trigger validation when invalid decimal amount is present', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        rent: {
                            amount: 123.123213,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid Rent amount, maximum two decimal places'));
                });
                it('should trigger validation when no amount is present', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        gas: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much you pay for Gas'));
                });
                it('should trigger validation when no schedule is present', async () => {
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        gas: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much you pay for Gas'));
                });
            });
            describe('on save and continue', () => {
                it('should save to the draft store', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: { amount: 100, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value },
                        rent: { amount: 200, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value },
                        councilTax: { amount: 100, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS.value },
                        gas: { amount: 200, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value },
                        electricity: { amount: 100, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value },
                        water: { amount: 100, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value },
                        maintenance: { amount: 100, schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.FOUR_WEEKS.value }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.StatementOfMeansPaths.debtsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
            describe('on reset this debt', () => {
                it('should reset the debt', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        gas: { amount: '1000', schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.WEEK.value },
                        action: { resetDebt: { 'gas': 'Reset this debt' } }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('gas[amount]"'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('1000'));
                });
            });
        });
    });
});
