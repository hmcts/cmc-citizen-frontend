"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const idamServiceMock = require("test/http-mocks/idam");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("directions-questionnaire/paths");
const app_1 = require("main/app");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.claimantHearingRequirementsReceiver.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const claimWithDQ = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { features: ['directionsQuestionnaire'] });
describe('Claimant response: confirmation page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when claimant click on download hearing requirements', () => {
                it('should call documentclient to download claimant hearing requirement', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                    claimStoreServiceMock.resolveRetrieveDocument();
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    draftStoreServiceMock.resolveFind('response');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful);
                });
            });
        });
    });
});
