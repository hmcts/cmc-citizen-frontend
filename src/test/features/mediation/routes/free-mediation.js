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
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const claim_1 = require("claims/models/claim");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.freeMediationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Mediation: Free mediation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when defendant is authorised', () => {
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
                it('should render page with the claimants name when everything is fine and not auto-registered', async () => {
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueObj), { totalAmountTillDateOfIssue: 400 }));
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .send({
                        otherPartyName: claim.claimData.claimant.name
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Free telephone mediation', claim.claimData.claimant.name));
                });
                it('should render page with automatic registration details when everything is fine and auto-registered', async () => {
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueObj), { features: ['admissions', 'mediationPilot'] }));
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .send({
                        otherPartyName: claim.claimData.claimant.name
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => {
                        chai_1.expect(res).to.be.successful.withText('Free telephone mediation', 'automatically registering');
                        chai_1.expect(res).to.be.successful.withoutText(claim.claimData.claimant.name);
                    });
                });
            });
        });
        context('when claimant is authorised', () => {
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
                it('should render page with the defendants name when everything is fine and not auto-registered', async () => {
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueObj), { totalAmountTillDateOfIssue: 400 }));
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .send({
                        otherPartyName: claim.claimData.defendant.name
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Free telephone mediation', claim.claimData.defendant.name));
                });
                it('should render page with automatic registration details when everything is fine and auto-registered', async () => {
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimIssueObj), { features: ['admissions', 'mediationPilot'] }));
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claim);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .send({
                        otherPartyName: claim.claimData.defendant.name
                    })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => {
                        chai_1.expect(res).to.be.successful.withText('Free telephone mediation', 'automatically registering');
                        chai_1.expect(res).to.be.successful.withoutText(claim.claimData.defendant.name);
                    });
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        context('when user authorised', () => {
            context('when form is valid', () => {
                context('as defendant', () => {
                    beforeEach(() => {
                        idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
                    });
                    alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
                    it('should redirect to how mediation works page when everything is fine for defendant', async () => {
                        ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('response');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.howMediationWorksPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
                it('should redirect to how mediation works page when everything is fine for claimant', async () => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.howMediationWorksPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
            });
        });
    });
});
