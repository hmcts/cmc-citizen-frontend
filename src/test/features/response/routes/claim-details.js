"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/common/checks/authorization-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const evidenceType_1 = require("forms/models/evidenceType");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.claimDetailsPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Defendant response: claim details page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                draftStoreServiceMock.resolveFindNoDraftFound();
                draftStoreServiceMock.resolveFind('mediation');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Claim details'));
            });
            it('should return 500 and render error page when cannot retrieve claim', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('internal service error when retrieving response');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should include evidence section when evidence was provided', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                    claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { evidence: { rows: [{ type: evidenceType_1.EvidenceType.PHOTO.value, description: 'my photo evidence' }] } })
                });
                draftStoreServiceMock.resolveFindNoDraftFound();
                draftStoreServiceMock.resolveFind('mediation');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Evidence'));
            });
            it('should not include evidence section when evidence was not provided', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId({ claim: Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj.claim), { evidence: null }) });
                draftStoreServiceMock.resolveFindNoDraftFound();
                draftStoreServiceMock.resolveFind('mediation');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withoutText('Evidence'));
            });
        });
    });
});
