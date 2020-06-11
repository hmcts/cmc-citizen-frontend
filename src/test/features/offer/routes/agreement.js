"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("offer/paths");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
describe('Settlement agreement: receipt', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.agreementReceiver.evaluateUri({ externalId: externalId }));
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(paths_1.Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return 500 and render error page when cannot generate PDF', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                claimStoreServiceMock.rejectRetrieveDocument('Something went wrong');
                await request(app_1.app)
                    .get(paths_1.Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should return receipt when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                claimStoreServiceMock.resolveRetrieveDocument();
                await request(app_1.app)
                    .get(paths_1.Paths.agreementReceiver.evaluateUri({ externalId: externalId }))
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful);
            });
        });
    });
});
