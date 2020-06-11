"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const app_1 = require("main/app");
const paths_1 = require("orders/paths");
const featureToggles_1 = require("utils/featureToggles");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.reviewOrderReceiver.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
    describe('Orders: confirmation page - review order pdf download', () => {
        hooks_1.attachDefaultHooks(app_1.app);
        describe('on GET', () => {
            context('when user authorised', () => {
                beforeEach(() => {
                    idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
                });
                context('when claimant or defendant click on review order pdf download', () => {
                    it('should download review order pdf', async () => {
                        claimStoreServiceMock.resolveRetrieveClaimIssueByExternalId({ features: 'admissions,directionsQuestionnaire' });
                        claimStoreServiceMock.resolveRetrieveDocument();
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful);
                    });
                    it('should return 500 and render error page when cannot generate PDF', async () => {
                        claimStoreServiceMock.rejectRetrieveDocument('HTTP error');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                });
            });
        });
    });
}
