"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/eligibility/routes/checks/authorization-check");
const paths_1 = require("eligibility/paths");
const app_1 = require("main/app");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
const claimValue_1 = require("eligibility/model/claimValue");
const pagePath = paths_1.Paths.claimValuePage.uri;
const pageRedirect = paths_1.Paths.helpWithFeesPage.uri;
const expectedTextOnPage = 'Total amount you’re claiming';
const notEligibleReason = notEligibleReason_1.NotEligibleReason.CLAIM_VALUE_NOT_KNOWN;
describe('Claim eligibility: claim value page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'get', pagePath);
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage));
        });
    });
    describe('on POST', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'post', pagePath);
        it('should render page when form is invalid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'));
        });
        it('should redirect to help with fees page when form is valid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ claimValue: claimValue_1.ClaimValue.UNDER_10000.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ claimValue: claimValue_1.ClaimValue.NOT_KNOWN.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason}`));
        });
    });
});
