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
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const cookieName = config.get('session.cookieName');
const pageContent = 'What annual rate of interest do you want to claim?';
const pagePath = paths_1.Paths.interestRatePage.uri;
describe('Claim issue: interest rate page', () => {
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
            it('should render the page when a different rate is selected but no rate is entered', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    reason: 'Special case'
                })
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'));
            });
            it('should render the page when a different rate is selected but no reason is entered', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    rate: '10'
                })
                    .expect(res => chai_1.expect(res).to.be.successful.withText(pageContent, 'div class="error-summary"'));
            });
            it('should return 500 and render error page when form is valid and cannot save draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: interestRateOption_1.InterestRateOption.STANDARD })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should redirect to interest date page when form is valid, 8% is selected and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ type: interestRateOption_1.InterestRateOption.STANDARD })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.interestDatePage.uri));
            });
            it('should redirect to interest date page when form is valid, a different rate is selected and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    rate: '10',
                    reason: 'Special case'
                })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.interestDatePage.uri));
            });
        });
    });
});
