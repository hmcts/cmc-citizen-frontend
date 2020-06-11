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
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.moreTimeConfirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: more time needed - confirmation page', () => {
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
                describe('should redirect to request more time page', () => {
                    it('when no option is selected', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.moreTimeRequestPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('when answer is "no"', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.NO } });
                        draftStoreServiceMock.resolveFind('mediation');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.moreTimeRequestPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
                it('should render confirmation page when answer is "yes" and everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true });
                    draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.YES } });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You have an extra 14 days to respond'));
                });
                it('should render confirmation page when more time already requested on claim', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true });
                    draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You have an extra 14 days to respond'));
                });
                it('should return 500 and render error page when answer is "yes" and cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('Internal server error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
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
                describe('should redirect to request more time page', () => {
                    it('when no option is selected', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: undefined } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.moreTimeRequestPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('when answer is "no', async () => {
                        draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.NO } });
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.redirect
                            .toLocation(paths_1.Paths.moreTimeRequestPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
                it('should redirect to task list page when "yes" selected and everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moreTimeRequested: true });
                    draftStoreServiceMock.resolveFind('response', { moreTimeNeeded: { option: moreTimeNeeded_1.MoreTimeNeededOption.YES } });
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.redirect
                        .toLocation(paths_1.Paths.taskListPage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
        });
    });
});
