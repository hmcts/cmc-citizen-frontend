"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/eligibility/routes/checks/authorization-check");
const app_1 = require("main/app");
const paths_1 = require("eligibility/paths");
const pagePath = paths_1.Paths.notEligiblePage.uri;
const expectedTextOnPage = 'You can’t use this service';
describe('Claim eligibility: not eligible page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'get', pagePath);
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage));
        });
    });
});
