"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const paths_1 = require("response/paths");
const responseType_1 = require("response/form/models/responseType");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.defenceRejectAllOfClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const draftOverride = {
    response: {
        type: responseType_1.ResponseType.DEFENCE
    }
};
describe('Defendant response: full admission options', () => {
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
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to response type page when response type is not full admission', async () => {
                    draftStoreServiceMock.resolveFind('response', { response: { type: responseType_1.ResponseType.PART_ADMISSION } });
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.responseTypePage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('response', draftOverride);
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('mediation');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Why do you believe you don’t owe'));
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
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                it('should redirect to response type page when response type is not full admission', async () => {
                    draftStoreServiceMock.resolveFind('response', { response: { type: responseType_1.ResponseType.PART_ADMISSION } });
                    draftStoreServiceMock.resolveFind('mediation');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.responseTypePage
                        .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                context('when form is invalid', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should render page when everything is fine', async () => {
                        draftStoreServiceMock.resolveFind('response', draftOverride);
                        draftStoreServiceMock.resolveFind('mediation');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Why do you believe you don’t owe', 'div class="error-summary"'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', draftOverride);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to how much paid claimant page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', draftOverride);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.taskListPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to send your response by email page when counterclaim option is selected', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('response', draftOverride);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ option: rejectAllOfClaim_1.RejectAllOfClaimOption.COUNTER_CLAIM })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.sendYourResponseByEmailPage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
            });
        });
    });
});
