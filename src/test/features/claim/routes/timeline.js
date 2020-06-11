"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.timelinePage.uri;
describe('Claim issue: timeline page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', pagePath);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(pagePath)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Timeline of events', 'If you don’t know the exact date, tell us the month and year.'));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', pagePath);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page when form is invalid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'));
            });
            it('should return 500 and render error page when form is valid and cannot save draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ rows: [{ 'date': 'may', 'description': 'ok' }] })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should render page with error when description missing', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ rows: [{ date: 'may' }] })
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'));
            });
            it('should render page with error when date missing', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ rows: [{ description: 'ok' }] })
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Timeline of events', 'div class="error-summary"'));
            });
            it('should redirect to timeline when form is valid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ rows: [{ date: 'may', description: 'ok' }] })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.evidencePage.uri));
            });
            describe('add row action', () => {
                it('should render page when valid input', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { addRow: 'Add row' } })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Timeline of events'));
                });
            });
        });
    });
});
