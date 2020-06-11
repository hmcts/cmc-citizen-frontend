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
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.finishPaymentController.evaluateUri({ externalId });
describe('Claim issue: finish payment page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        it('should redirect to check and send page if claim is not found', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim', { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode();
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.checkAndSendPage.uri));
        });
        it('should create claim and redirect to check and send page if claim is in AWAITING_CITIZEN_PAYMENT state', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim', { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' });
            claimStoreServiceMock.resolveRetrieveUserRoles();
            claimStoreServiceMock.resolveCreateClaimCitizen({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' });
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.checkAndSendPage.uri));
        });
        it('should create claim delete draft and redirect to confirmation page if created claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim', { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' });
            claimStoreServiceMock.resolveRetrieveUserRoles();
            claimStoreServiceMock.resolveCreateClaimCitizen({ externalId, state: 'OPEN' });
            draftStoreServiceMock.resolveDelete();
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId })));
        });
        it('should delete draft and redirect to confirmation page if claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim', { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'OPEN' });
            draftStoreServiceMock.resolveDelete();
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId })));
        });
    });
});
