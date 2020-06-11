"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const authorization_check_1 = require("test/features/dashboard/routes/checks/authorization-check");
const cookieName = config.get('session.cookieName');
const defendantPage = paths_1.Paths.defendantPage.evaluateUri({ externalId: 'b17af4d2-273f-4999-9895-bce382fa24c8' });
describe('Dashboard - defendant page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', defendantPage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve claims', async () => {
                claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                await request(app_1.app)
                    .get(defendantPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            context('when at least one claim issued', () => {
                it('should render page when everything is fine', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    await request(app_1.app)
                        .get(defendantPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim number', claimStoreServiceMock.sampleClaimObj.referenceNumber));
                });
                it('should return forbidden when accessor is not the defendant', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({
                        submitterId: claimStoreServiceMock.sampleClaimObj.defendantId,
                        defendantId: claimStoreServiceMock.sampleClaimObj.submitterId
                    });
                    await request(app_1.app)
                        .get(defendantPage)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.forbidden);
                });
            });
        });
    });
});
