"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const paths_1 = require("response/paths");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const app_1 = require("main/app");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const incomeExpenseSchedule_1 = require("response/form/models/statement-of-means/incomeExpenseSchedule");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.StatementOfMeansPaths.monthlyExpensesPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: Statement of means: monthly-expenses', () => {
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
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when response and CCJ not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('What are your regular expenses?'));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen', 'defendant');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            describe('errors are handled properly', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should trigger validation when negative amount is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: {
                            amount: -100,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        rent: {
                            amount: -200,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid mortgage amount, maximum two decimal places'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid rent amount, maximum two decimal places'));
                });
                it('should trigger validation when invalid decimal amount is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: {
                            amount: 100.123,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        rent: {
                            amount: 200.345,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid mortgage amount, maximum two decimal places'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid rent amount, maximum two decimal places'));
                });
                it('should trigger validation when no amount is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        rent: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much you pay for mortgage'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much you pay for rent'));
                });
                it('should trigger validation when no schedule is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: {
                            amount: 100
                        },
                        rent: {
                            amount: 700
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Select how often you pay for mortgage'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Select how often you pay for rent'));
                });
            });
            describe('save and continue', () => {
                it('should update draft store and redirect', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        mortgage: 1,
                        rent: 1,
                        councilTax: 1,
                        gas: 1,
                        electricity: 1,
                        water: 1,
                        travel: 1,
                        schoolCosts: 1,
                        foodAndHousekeeping: 1,
                        tvAndBroadband: 1,
                        phone: 1,
                        maintenance: 1,
                        rows: [{ amount: 10, description: 'bla bla bla' }]
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.StatementOfMeansPaths.monthlyIncomePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
            describe('other actions', () => {
                it('should add new row', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        other: [
                            {
                                name: '',
                                amount: ''
                            },
                            {
                                name: '',
                                amount: ''
                            }
                        ],
                        action: { addOther: 'Add another expense' }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('other[2][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('other[3][name]'));
                });
                it('should remove row', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        other: [
                            {
                                name: '',
                                amount: ''
                            },
                            {
                                name: '',
                                amount: ''
                            }
                        ],
                        action: { removeOther: 'Remove this expense source' }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('other[0][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('other[1][name]'));
                });
                it('should remove row', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        other: [
                            {
                                name: 'abcdefghijkl',
                                amount: '1234'
                            }
                        ],
                        action: {
                            reset: {
                                'other.0': 'Reset this expense source'
                            }
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('other[0][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('abcdefghijkl'));
                });
            });
        });
    });
});
