"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const momentFactory_1 = require("shared/momentFactory");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.defendantDateOfBirthPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const expectedText = 'Enter your date of birth';
describe('Defendant user details: your date of birth page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                beforeEach(() => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText(expectedText));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                context('when form is invalid', () => {
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText(expectedText, 'div class="error-summary"'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ known: 'true', date: { year: '1978', month: '1', day: '11' } })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to your phone page when phone is not provided by claimant', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ known: 'true', date: { year: '1978', month: '1', day: '11' } })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.defendantPhonePage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to the under-18 hand-off page when the date is too recent', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        const fifteenYearsAgo = momentFactory_1.MomentFactory.currentDate().subtract(15, 'years');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({
                            known: 'true', date: {
                                year: fifteenYearsAgo.year(),
                                month: fifteenYearsAgo.month() + 1,
                                day: fifteenYearsAgo.date()
                            }
                        })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.under18Page
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to task list when phone is provided by claimant', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimBySampleExternalId(claimStoreServiceMock.sampleClaimIssueOrgVOrgPhone);
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ known: 'true', date: { year: '1978', month: '1', day: '11' } })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.taskListPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
            });
        });
    });
});
