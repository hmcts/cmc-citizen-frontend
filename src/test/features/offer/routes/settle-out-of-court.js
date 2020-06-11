"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("offer/paths");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/offer/routes/checks/authorization-check");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const settleOutOfCourtPage = paths_1.Paths.settleOutOfCourtPage.evaluateUri({ externalId: externalId });
describe('Settle out of court page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', settleOutOfCourtPage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(settleOutOfCourtPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page when everything is fine', async () => {
                claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                await request(app_1.app)
                    .get(settleOutOfCourtPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Make an offer to settle out of court'));
            });
        });
    });
});
