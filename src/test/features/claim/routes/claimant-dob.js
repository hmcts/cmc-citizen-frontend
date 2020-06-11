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
const momentFactory_1 = require("shared/momentFactory");
const cookieName = config.get('session.cookieName');
describe('Claim issue: claimant date of birth page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.claimantDateOfBirthPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.claimantDateOfBirthPage.uri);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(paths_1.Paths.claimantDateOfBirthPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('What is your date of birth?'));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.claimantDateOfBirthPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', paths_1.Paths.claimantDateOfBirthPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page when form is empty and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                await request(app_1.app)
                    .post(paths_1.Paths.claimantDateOfBirthPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('What is your date of birth?', 'div class="error-summary"'));
            });
            it('should render page with error when DOB is less than 18', async () => {
                draftStoreServiceMock.resolveFind('claim');
                const date = momentFactory_1.MomentFactory.currentDate().subtract(1, 'year');
                await request(app_1.app)
                    .post(paths_1.Paths.claimantDateOfBirthPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ known: 'true', date: { day: date.date(), month: date.month() + 1, year: date.year() } })
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Please enter a date of birth before', 'div class="error-summary"'));
            });
            it('should return 500 and render error page when form is valid and cannot save draft', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.rejectUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.claimantDateOfBirthPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
                    .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
            });
            it('should redirect to claimant phone page when form is valid and everything is fine', async () => {
                draftStoreServiceMock.resolveFind('claim');
                draftStoreServiceMock.resolveUpdate();
                await request(app_1.app)
                    .post(paths_1.Paths.claimantDateOfBirthPage.uri)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send({ known: 'true', date: { day: '31', month: '12', year: '1980' } })
                    .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.claimantPhonePage.uri));
            });
        });
    });
});
