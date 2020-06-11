"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const idamServiceMock = require("test/http-mocks/idam");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const pagePath = paths_1.Paths.initiatePaymentController.uri;
const draftType = 'claim:ioc';
const roles = 'citizen';
describe('Claim: Initiate payment page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', pagePath);
        it('should redirect to nextUrl returned by initiate payment if claim is not found', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', roles);
            draftStoreServiceMock.resolveFind(draftType, { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode();
            claimStoreServiceMock.resolveInitiatePayment({ nextUrl: 'http://payment-api-initiate' });
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation('http://payment-api-initiate'));
        });
        it('should redirect to finishPaymentReceiver if claim is not found in claim store but payment is successful', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', roles);
            draftStoreServiceMock.resolveFind('claim', { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalIdTo404HttpCode();
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.startPaymentReceiver.uri));
        });
        it('should redirect to nextUrl returned by resume payment if claim is in AWAITING_CITIZEN_PAYMENT state', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', roles);
            draftStoreServiceMock.resolveFind(draftType, { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'AWAITING_CITIZEN_PAYMENT' });
            claimStoreServiceMock.resolveResumePayment({ nextUrl: 'http://payment-api-resume' });
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation('http://payment-api-resume'));
        });
        it('should redirect to confirmation page if claim is not in AWAITING_CITIZEN_PAYMENT state', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', roles);
            draftStoreServiceMock.resolveFind(draftType, { externalId });
            claimStoreServiceMock.resolveRetrieveClaimByExternalId({ externalId, state: 'CREATE' });
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId })));
        });
    });
});
