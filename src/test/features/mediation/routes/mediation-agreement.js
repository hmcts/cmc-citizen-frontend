"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("mediation/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.mediationAgreementPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Free mediation: mediation agreement page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET for defendant', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You can only use free mediation if'));
                });
            });
        });
    });
    describe('on GET for claimant', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            context('when response not submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('You can only use free mediation if'));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised as defendant', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                context('when form is invalid', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when cannot save draft', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.rejectUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ reject: 'I don’t agree' })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to phone number page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ accept: 'I agree' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.canWeUsePage
                            .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to response task list when No was chosen and it is defendant', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('response');
                        draftStoreServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ reject: 'I don’t agree' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.continueWithoutMediationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
            });
        });
        context('when user authorised as claimant', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            it('should redirect to claimant response task list when No was chosen and it is claimant', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleDefendantResponseObj);
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('response');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ reject: 'I don’t agree' })
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.continueWithoutMediationPage
                    .evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
            });
        });
    });
});
