"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claim_store_1 = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const externalId = '400f4c57-9684-49c0-adb4-4cf46579d6dc';
const path = paths_1.Paths.sealedClaimPdfReceiver;
describe('Sealed Claim: pdf', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', path.evaluateUri({ externalId: externalId }));
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claim_store_1.sampleClaimObj.defendantId, 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                claim_store_1.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(path.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot generate PDF', async () => {
                claim_store_1.resolveRetrieveClaimByExternalId();
                claim_store_1.rejectRetrieveDocument('HTTP error');
                await request(app_1.app)
                    .get(path.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return receipt when everything is fine', async () => {
                claim_store_1.resolveRetrieveClaimByExternalId();
                claim_store_1.resolveRetrieveDocument();
                await request(app_1.app)
                    .get(path.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful);
            });
        });
    });
});
