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
const freeMediation_1 = require("forms/models/freeMediation");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.howMediationWorksPage.evaluateUri({ externalId });
describe('Mediation: how mediation works page', () => {
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
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How free mediation works'));
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
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How free mediation works'));
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
            it('should redirect to will you try mediation page when everything is fine for the defendant', async () => {
                ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('response');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ mediationYes: 'yes' })
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.willYouTryMediation.evaluateUri({ externalId })));
            });
            context('when mediation pilot is enabled', () => {
                const mediationPilotOverride = {
                    totalAmountTillToday: 200,
                    features: [...claimStoreServiceMock.sampleClaimObj.features, 'mediationPilot']
                };
                it('should redirect to the mediation agreement page when everything is fine for the defendant', async () => {
                    ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ mediationYes: freeMediation_1.FreeMediationOption.YES })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.mediationAgreementPage.evaluateUri({ externalId })));
                });
                it('should redirect to mediation disagreement when defendant says no to mediation', async () => {
                    ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ mediationNo: freeMediation_1.FreeMediationOption.NO })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.mediationDisagreementPage.evaluateUri({ externalId })));
                });
            });
        });
        context('when user authorised as claimant', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            it('should redirect to the will you try mediation page when everything is fine for the claimant', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('response');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ mediationYes: freeMediation_1.FreeMediationOption.YES })
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.willYouTryMediation.evaluateUri({ externalId })));
            });
            context('when mediation pilot is enabled', () => {
                const mediationPilotOverride = {
                    totalAmountTillToday: 200,
                    features: [...claimStoreServiceMock.sampleClaimObj.features, 'mediationPilot']
                };
                it('should redirect to the mediation agreement page when everything is fine for the claimant', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ mediationYes: freeMediation_1.FreeMediationOption.YES })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.mediationAgreementPage.evaluateUri({ externalId })));
                });
                it('should redirect to the task list when claimant says no to mediation', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(mediationPilotOverride);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ mediationNo: freeMediation_1.FreeMediationOption.NO })
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.mediationDisagreementPage.evaluateUri({ externalId })));
                });
            });
        });
    });
});
