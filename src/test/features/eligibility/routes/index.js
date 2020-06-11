"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/eligibility/routes/checks/authorization-check");
const paths_1 = require("eligibility/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
const pagePath = paths_1.Paths.startPage.uri;
describe('Claim eligibility: index page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'get', pagePath);
        context('when user is logged in', () => {
            it('should render page when everything is fine', async () => {
                idamServiceMock.resolveRetrieveUserFor('1');
                await request(app_1.app)
                    .get(pagePath)
                    .set('Cookie', `${cookieName}=ABC;`)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Find out if you can make a claim using this service'));
            });
        });
        context('when user is logged out', () => {
            it('should render page when everything is fine', async () => {
                await request(app_1.app)
                    .get(pagePath)
                    .expect(res => chai_1.expect(res).to.be.successful.withText('Try the new online service'));
            });
        });
    });
});
