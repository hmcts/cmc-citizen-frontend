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
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const cookieName = config.get('session.cookieName');
const pageContent = 'When do you want to stop claiming interest?';
const pagePath = paths_1.Paths.interestEndDatePage.uri;
describe('Claim issue: interest end date page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', pagePath);
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
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', pagePath);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page when form is invalid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'));
            });
            it('should return 500 and render error page when form is valid and cannot save draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ option: interestEndDate_1.InterestEndDateOption.SUBMISSION })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should redirect to total page when form is valid, submission date selected and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ option: interestEndDate_1.InterestEndDateOption.SUBMISSION })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.totalPage.uri));
            });
            it('should redirect to total page when form is valid, settled or judgment is selected and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.totalPage.uri));
            });
        });
    });
});
