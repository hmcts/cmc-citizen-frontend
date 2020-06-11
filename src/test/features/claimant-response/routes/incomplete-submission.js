"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
describe('Claimant response: incomplete submission page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
        });
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            draftStoreServiceMock.resolveFind('claimantResponse');
            draftStoreServiceMock.resolveFind('mediation');
            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful
                .withText('You need to complete all sections before you submit your response'));
        });
    });
});
