"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("paid-in-full/paths");
const app_1 = require("main/app");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.datePaidPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
describe('Claimant paid in full: money received on page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when service is unhealthy', () => {
                it('should return 500 and render error page when cannot retrieve claim by external id', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            context('when claimant has been paid in full', () => {
                it('should display form asking when money was received', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('When did you settle with the defendant?'));
                });
            });
            context('when claimant has already been paid in full', () => {
                it('should display forbidden page', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId({ moneyReceivedOn: momentFactory_1.MomentFactory.currentDate().subtract(1, 'day') });
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.forbidden.withText('Forbidden'));
                });
            });
        });
    });
});
