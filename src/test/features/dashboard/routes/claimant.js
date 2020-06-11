"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("dashboard/paths");
const paths_2 = require("ccj/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/dashboard/routes/checks/authorization-check");
const draft_store_1 = require("test/http-mocks/draft-store");
const party_1 = require("test/data/entity/party");
const cookieName = config.get('session.cookieName');
const draftPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: 'draft' });
const claimPagePath = paths_1.Paths.claimantPage.evaluateUri({ externalId: draft_store_1.sampleClaimDraftObj.externalId });
describe('Dashboard - claimant page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', claimPagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when claim is in draft stage', () => {
                it('should render page when everything is fine', async () => {
                    await request(app_1.app)
                        .get(draftPagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim number', 'Draft'));
                });
            });
            context('when claim is not in draft stage', () => {
                it('should return 500 and render error page when cannot retrieve claims', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(claimPagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(claimPagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim number', claimStoreServiceMock.sampleClaimObj.referenceNumber));
                });
                context('when accessor is not the claimant', () => {
                    it('should return forbidden', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                            submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
                            defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
                        });
                        await request(app_1.app)
                            .get(claimPagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.forbidden);
                    });
                });
            });
        });
    });
    describe('on POST for requesting a CCJ', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', claimPagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when claim is in draft stage', () => {
                it(`should render error page`, async () => {
                    await request(app_1.app)
                        .post(draftPagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error', 'Draft external ID is not supported'));
                });
            });
            context('when claim is not in draft stage', () => {
                context('when accessor is not the claimant', () => {
                    it('should return forbidden', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                            submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
                            defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
                        });
                        await request(app_1.app)
                            .post(claimPagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.forbidden);
                    });
                });
                context('when defendant is an individual', () => {
                    it('should redirect to CCJ / defendant date of birth page', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                            claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { defendants: [party_1.individual] })
                        });
                        await request(app_1.app)
                            .post(claimPagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.dateOfBirthPage.evaluateUri({ externalId: draft_store_1.sampleClaimDraftObj.externalId })));
                    });
                });
                context('when defendant is not an individual', () => {
                    [party_1.soleTrader, party_1.company, party_1.organisation].forEach(party => {
                        it(`should redirect to CCJ paid amount page when defendant is ${party.type}`, async () => {
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                                claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { defendants: [party] })
                            });
                            await request(app_1.app)
                                .post(claimPagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.paidAmountPage.evaluateUri({ externalId: draft_store_1.sampleClaimDraftObj.externalId })));
                        });
                    });
                });
            });
        });
    });
});
