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
describe('Claim issue: amount page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.amountPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.amountPage.uri);
        it('should render page when everything is fine', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            draftStoreServiceMock.resolveFind('claim');
            await request(app_1.app)
                .get(paths_1.Paths.amountPage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'post', paths_1.Paths.amountPage.uri);
        eligibility_check_1.checkEligibilityGuards(app_1.app, 'post', paths_1.Paths.amountPage.uri);
        describe('for authorized user', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            describe('add row action', () => {
                it('should render page when form is invalid and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { addRow: 'Add row' } })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
                });
                it('should render page when form is valid, amount within limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { addRow: 'Add row' }, rows: [{ reason: 'Damaged roof', amount: '299' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
                });
                it('should render page when form is valid, amount above limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { addRow: 'Add row' }, rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
                });
            });
            describe('calculate action', () => {
                it('should render page when form is invalid and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { calculate: 'Calculate' } })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'));
                });
                it('should render page when form is valid, amount within limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { calculate: 'Calculate' }, rows: [{ reason: 'Damaged roof', amount: '299' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
                });
                it('should render page when form is valid, amount above limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ action: { calculate: 'Calculate' }, rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount'));
                });
            });
            describe('save action', () => {
                it('should render page when form is invalid and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'));
                });
                it('should render page when reason is given but no amount', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ rows: [{ reason: 'Damaged roof' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'));
                });
                it('should render page when amount is given but no reasons', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ rows: [{ amount: '299' }] })
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Claim amount', 'div class="error-summary"'));
                });
                it('should return 500 and render error page when form is valid, amount within limit and cannot save draft', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    draftStoreServiceMock.rejectUpdate();
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ rows: [{ reason: 'Damaged roof', amount: '299' }] })
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to interest page when form is valid, amount within limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ rows: [{ reason: 'Damaged roof', amount: '299' }] })
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.interestPage.uri));
                });
                it('should redirect to amount exceeded page when form is valid, amount above limit and everything is fine', async () => {
                    draftStoreServiceMock.resolveFind('claim');
                    await request(app_1.app)
                        .post(paths_1.Paths.amountPage.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({ rows: [{ reason: 'Damaged roof', amount: '10000.01' }] })
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.ErrorPaths.amountExceededPage.uri));
                });
            });
        });
    });
});
