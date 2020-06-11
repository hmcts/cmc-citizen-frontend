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
const pagePath = paths_1.StatementOfMeansPaths.monthlyIncomePage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: Statement of means: monthly-income', () => {
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
                        .expect(res => chai_1.expect(res).to.be.successful.withText('What regular income do you receive?'));
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
                        salarySource: {
                            amount: -100,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        pensionSource: {
                            amount: -200,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid income from your job amount, maximum two decimal places'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid pension amount, maximum two decimal places'));
                });
                it('should trigger validation when invalid decimal amount is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        salarySource: {
                            amount: 100.123,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        jobseekerAllowanceIncomeSource: {
                            amount: 200.345,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid income from your job amount, maximum two decimal places'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter a valid Jobseeker’s Allowance (income based) amount, maximum two decimal places'));
                });
                it('should trigger validation when no amount is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        salarySource: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        incomeSupportSource: {
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much income from your job you receive'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Enter how much Income Support you receive'));
                });
                it('should trigger validation when no schedule is given', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        salarySource: {
                            amount: 100
                        },
                        childTaxCreditSource: {
                            amount: 700
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Select how often you receive income from your job'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Select how often you receive Child Tax Credit'));
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
                        salarySource: {
                            amount: 100,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        universalCreditSource: {
                            amount: 200,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        jobseekerAllowanceIncomeSource: {
                            amount: 300,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        },
                        jobseekerAllowanceContributionSource: {
                            amount: 400,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        incomeSupportSource: {
                            amount: 500,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        workingTaxCreditSource: {
                            amount: 600,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        },
                        childTaxCreditSource: {
                            amount: 700,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        childBenefitSource: {
                            amount: 800,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.MONTH.value
                        },
                        councilTaxSupportSource: {
                            amount: 900,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        },
                        pensionSource: {
                            amount: 100,
                            schedule: incomeExpenseSchedule_1.IncomeExpenseSchedule.TWO_WEEKS.value
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.StatementOfMeansPaths.explanationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
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
                        otherSources: [
                            {
                                name: '',
                                amount: ''
                            },
                            {
                                name: '',
                                amount: ''
                            }
                        ],
                        action: { addOtherIncomeSource: 'Add another income' }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('otherSources[2][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('otherSources[3][name]'));
                });
                it('should remove row', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        otherSources: [
                            {
                                name: '',
                                amount: ''
                            },
                            {
                                name: '',
                                amount: ''
                            }
                        ],
                        action: { removeOtherIncomeSource: 'Remove this income source' }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('otherSources[0][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('otherSources[1][name]'));
                });
                it('should reset row', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('response:full-admission');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .send({
                        otherSources: [
                            {
                                name: 'abcdefghijkl',
                                amount: '1234'
                            }
                        ],
                        action: {
                            resetIncomeSource: {
                                'otherSources.0': 'Reset this income source'
                            }
                        }
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('otherSources[0][name]'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('abcdefghijkl'));
                });
            });
        });
    });
});
