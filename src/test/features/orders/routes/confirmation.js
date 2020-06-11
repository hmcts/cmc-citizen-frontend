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
const paths_1 = require("orders/paths");
const app_1 = require("main/app");
const featureToggles_1 = require("utils/featureToggles");
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
    describe('Orders confirmation page', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            const method = 'get';
            authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
            not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
                });
                context('when claimant response submitted', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should render page when everything is fine', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                        claimStoreServiceMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-07-01'));
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('You’ve asked the court to review the order'));
                    });
                });
            });
        });
    });
}
