"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const evidenceType_1 = require("forms/models/evidenceType");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.evidencePage.uri;
const pageContent = 'List any evidence';
describe('Claim issue: evidence', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, method, pagePath);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText(pageContent));
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should return 500 and render error page when cannot retrieve draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('valid form should redirect to task list', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate(100);
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ rows: [{ type: evidenceType_1.EvidenceType.CONTRACTS_AND_AGREEMENTS.value, description: 'Bla bla' }] })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.uri));
            });
            it('should render page when missing description', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    rows: [{
                            type: evidenceType_1.EvidenceType.CONTRACTS_AND_AGREEMENTS.value,
                            description: undefined
                        }]
                })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.taskListPage.uri));
            });
            describe('add row action', () => {
                it('should render page when valid input', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { addRow: 'Add row' } })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('List any evidence (optional)'));
                });
            });
        });
    });
});
