"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("dashboard/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const authorization_check_1 = require("test/features/dashboard/routes/checks/authorization-check");
const cookieName = config.get('session.cookieName');
const howMediationWorksPage = paths_1.Paths.howFreeMediationWorksPage.uri;
describe('Dashboard - How mediation works page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', howMediationWorksPage);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            });
            it('should render page when everything is fine', async () => {
                await request(app_1.app)
                    .get(howMediationWorksPage)
                    .set('Cookie', `${cookieName}=ABC`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('A mediator phones you'));
            });
        });
    });
});
