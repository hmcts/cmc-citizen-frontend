"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const hooks_1 = require("test/routes/hooks");
const paths_1 = require("claimant-response/paths");
const authorization_check_1 = require("test/routes/authorization-check");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const cookieName = config.get('session.cookieName');
const taskListPagePath = paths_1.Paths.taskListPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const incompleteSubmissionPagePath = paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
describe('Claimant response: task list page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', incompleteSubmissionPagePath);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claimantResponse');
            draftStoreServiceMock.resolveFind('mediation');
            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
            claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
            await request(app_1.app)
                .get(taskListPagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Your response'));
        });
    });
});
