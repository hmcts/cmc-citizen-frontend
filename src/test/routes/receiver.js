"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths_1 = require("paths");
const chai_1 = require("chai");
const paths_2 = require("claim/paths");
const paths_3 = require("eligibility/paths");
const config = require("config");
const cookieEncrypter = require("@hmcts/cookie-encrypter");
const paths_4 = require("dashboard/paths");
const store_1 = require("eligibility/store");
const eligibility_1 = require("test/data/cookie/eligibility");
const request = require("supertest");
const app_1 = require("main/app");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const idamServiceMock = require("test/http-mocks/idam");
require("test/routes/expectations");
const hooks_1 = require("test/routes/hooks");
const cookieName = config.get('session.cookieName');
describe('Login receiver', async () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', async () => {
        describe('for authorized user', async () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should save bearer token in cookie when auth token is retrieved from idam', async () => {
                const token = 'I am dummy access token';
                idamServiceMock.resolveExchangeCode(token);
                await request(app_1.app)
                    .get(`${paths_1.Paths.receiver.uri}?code=ABC&state=123`)
                    .set('Cookie', 'state=123')
                    .expect(res => chai_1.expect(res).to.have.cookie(cookieName, token));
            });
            it('should clear state cookie when auth token is retrieved from idam', async () => {
                const token = 'I am dummy access token';
                idamServiceMock.resolveExchangeCode(token);
                await request(app_1.app)
                    .get(`${paths_1.Paths.receiver.uri}?code=ABC&state=123`)
                    .set('Cookie', 'state=123')
                    .expect(res => chai_1.expect(res).to.have.cookie('state', ''));
            });
            it('should return 500 and render error page when cannot retrieve claimant claims', async () => {
                const token = 'I am dummy access token';
                idamServiceMock.resolveExchangeCode(token);
                claimStoreServiceMock.resolveLinkDefendant();
                claimStoreServiceMock.rejectRetrieveByClaimantId('HTTP error');
                await request(app_1.app)
                    .get(`${paths_1.Paths.receiver.uri}?code=ABC&state=123`)
                    .set('Cookie', 'state=123')
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot retrieve defendant claims', async () => {
                claimStoreServiceMock.resolveLinkDefendant();
                claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                claimStoreServiceMock.rejectRetrieveByDefendantId('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.receiver.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot retrieve claim drafts', async () => {
                claimStoreServiceMock.resolveLinkDefendant();
                claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                draftStoreServiceMock.rejectFind('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.receiver.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot retrieve response drafts', async () => {
                claimStoreServiceMock.resolveLinkDefendant();
                claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                draftStoreServiceMock.resolveFindNoDraftFound();
                draftStoreServiceMock.rejectFind('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.receiver.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when valid eligibility cookie exists (user with intention to create a claim)', async () => {
                it('should redirect to task list', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    const encryptedEligibilityCookie = cookieEncrypter.encryptCookie('j:' + JSON.stringify(eligibility_1.eligibleCookie), { key: config.get('secrets.cmc.encryptionKey') });
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC;${store_1.cookieName}=e:${encryptedEligibilityCookie}`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_2.Paths.taskListPage.uri));
                });
            });
            context('when no claim issued or received and no drafts (new claimant)', async () => {
                it('should redirect to eligibility start page', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_3.Paths.startPage.uri));
                });
            });
            context('when only draft claim exists (claimant making first claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    draftStoreServiceMock.resolveFind('claim');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when only claim issued (claimant made first claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantId();
                    claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when claim issued and draft claim exists (claimant making another claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantId();
                    claimStoreServiceMock.resolveRetrieveByDefendantIdToEmptyList();
                    draftStoreServiceMock.resolveFind('claim');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when only claim received (defendant served with first claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when claim received and draft response exists (defendant responding to claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when claim received and draft claim exists (defendant making first claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantIdToEmptyList();
                    claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001');
                    draftStoreServiceMock.resolveFind('claim');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
            context('when claim received and another claim issued (defendant made first claim)', async () => {
                it('should redirect to dashboard', async () => {
                    claimStoreServiceMock.resolveLinkDefendant();
                    claimStoreServiceMock.resolveRetrieveByClaimantId();
                    claimStoreServiceMock.resolveRetrieveByDefendantId('000MC001');
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    draftStoreServiceMock.resolveFindNoDraftFound();
                    await request(app_1.app)
                        .get(paths_1.Paths.receiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_4.Paths.dashboardPage.uri));
                });
            });
        });
        describe('for expired user credentials', () => {
            it('should redirect to login', async () => {
                const token = 'I am dummy access token';
                idamServiceMock.rejectExchangeCode(token);
                await request(app_1.app)
                    .get(`${paths_1.Paths.receiver.uri}?code=ABC&state=123`)
                    .set('Cookie', 'state=123')
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(/.*\/login.*/));
            });
        });
    });
});
describe('Defendant link receiver', () => {
    const pagePath = paths_1.Paths.linkDefendantReceiver.uri;
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-1');
            });
            it('should redirect to /receiver', async () => {
                const token = 'token';
                idamServiceMock.resolveExchangeCode(token);
                await request(app_1.app)
                    .get(`${pagePath}?code=123`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.receiver.uri));
            });
            it('should set session cookie to token value returned from idam', async () => {
                const token = 'token';
                idamServiceMock.resolveExchangeCode(token);
                await request(app_1.app)
                    .get(`${pagePath}?code=123`)
                    .expect(res => chai_1.expect(res).to.have.cookie(cookieName, token));
            });
        });
    });
});
