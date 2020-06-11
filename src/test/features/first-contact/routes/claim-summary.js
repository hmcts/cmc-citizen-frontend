"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/first-contact/routes/checks/authorization-check");
const paths_1 = require("first-contact/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const momentFactory_1 = require("shared/momentFactory");
const evidenceType_1 = require("forms/models/evidenceType");
const cookieName = config.get('session.cookieName');
describe('Defendant first contact: claim summary page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.claimSummaryPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder');
            });
            it('should redirect to access denied page when not eligible page claim reference number does not match', async () => {
                claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001');
                await request(app_1.app)
                    .get(paths_1.Paths.claimSummaryPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.ErrorPaths.claimSummaryAccessDeniedPage.uri));
            });
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveByLetterHolderId('HTTP error');
                await request(app_1.app)
                    .get(`${paths_1.Paths.claimSummaryPage.uri}`)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 200 and render view when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001');
                await request(app_1.app)
                    .get(paths_1.Paths.claimSummaryPage.uri)
                    .set('Cookie', `${cookieName}=ABC;state=000MC001`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Claim details'));
            });
            it('should include evidence section when evidence was provided', async () => {
                claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001', {
                    claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { evidence: { rows: [{ type: evidenceType_1.EvidenceType.PHOTO.value, description: 'my photo evidence' }] } })
                });
                await request(app_1.app)
                    .get(paths_1.Paths.claimSummaryPage.uri)
                    .set('Cookie', `${cookieName}=ABC;state=000MC001`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Evidence'));
            });
            it('should not include evidence section when evidence was not provided', async () => {
                claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC001', { claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { evidence: null }) });
                await request(app_1.app)
                    .get(paths_1.Paths.claimSummaryPage.uri)
                    .set('Cookie', `${cookieName}=ABC;state=000MC001`)
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Evidence'));
            });
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.claimSummaryPage.uri);
        it('should redirect to registration page when everything is fine', async () => {
            const registrationPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/uplift\\?response_type=code&state=1&client_id=cmc_citizen&redirect_uri=https://127.0.0.1:[0-9]{5}/receiver&jwt=ABC`);
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder');
            await request(app_1.app)
                .post(paths_1.Paths.claimSummaryPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(registrationPagePattern));
        });
        it('should clear session cookie when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder');
            await request(app_1.app)
                .post(paths_1.Paths.claimSummaryPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.have.cookie(cookieName, ''));
        });
    });
    describe('CCJ was requested', () => {
        it('should redirect to ccj error page', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder');
            claimStoreServiceMock.resolveRetrieveByLetterHolderId('000MC000', { countyCourtJudgmentRequestedAt: momentFactory_1.MomentFactory.parse('2010-10-10') });
            await request(app_1.app)
                .get(paths_1.Paths.claimSummaryPage.uri)
                .set('Cookie', `${cookieName}=ABC;state = 000MC000`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.ErrorPaths.ccjRequestedHandoffPage.uri));
        });
    });
});
