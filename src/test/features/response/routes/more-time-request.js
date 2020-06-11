"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const HttpStatus = require("http-status-codes");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.moreTimeRequestPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: more time needed page', () => {
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
                describe('should render editable page', async () => {
                    it('when no option selected', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolvePostponedDeadline('2020-01-01');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Do you want more time to respond?', 'You’ll have to respond before 4pm on 1 January 2020'));
                    });
                    it('when answer is "no"', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.NO } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolvePostponedDeadline('2020-01-01');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Do you want more time to respond?', 'You’ll have to respond before 4pm on 1 January 2020'));
                    });
                    it('when deadline calculation fails', async () => {
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.rejectPostponedDeadline();
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                it('should redirect to confirmation page when answer is "yes"', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true });
                    draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.YES } });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.redirect
                        .toLocation(paths_1.Paths.moreTimeConfirmationPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
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
                it('should redirect to confirmation page when more time already requested', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true });
                    draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.redirect
                        .toLocation(paths_1.Paths.moreTimeConfirmationPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                context('when form is invalid', () => {
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: false });
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolvePostponedDeadline('2020-01-01');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(HttpStatus.OK)
                            .expect(res => chai_1.expect(res.text).to.include('Do you want more time to respond?', 'div class="error-summary"'));
                    });
                });
                context('when form is valid', () => {
                    it('should redirect to task list page when "no" is selected and everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'no' })
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.taskListPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to confirmation page page when "yes" is selected and everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRequestForMoreTime();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.moreTimeConfirmationPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should return 500 and render error page when "yes" is selected and cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when "yes" is selected and cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal server error when retrieving claim');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 when "yes" is selected and cannot request more time', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.rejectRequestForMoreTime('internal server error when requesting more time');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: 'yes' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('when deadline calculation fails', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: false });
                        claimStoreServiceMock.rejectPostponedDeadline();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
            });
        });
    });
});
