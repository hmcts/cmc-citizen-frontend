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
const claimType_1 = require("eligibility/model/claimType");
const pagePath = paths_1.Paths.claimTypePage.uri;
const pageRedirect = paths_1.Paths.claimantAddressPage.uri;
const expectedTextOnPage = 'Who are you making the claim for?';
describe('Claim eligibility: claim type page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    context('on GET', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'get', pagePath);
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage));
        });
    });
    context('on POST', () => {
        authorization_check_1.checkAuthorizationMiddleware(app_1.app, 'post', pagePath);
        it('should render page when form is invalid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage, 'div class="error-summary"'));
        });
        it('should redirect to single defendant page when form is valid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ claimType: claimType_1.ClaimType.PERSONAL_CLAIM.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to not eligible page when form is valid and multiple claimants option selected', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ claimType: claimType_1.ClaimType.MULTIPLE_CLAIM.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason_1.NotEligibleReason.MULTIPLE_CLAIMANTS}`));
        });
        it('should redirect to not eligible page when form is valid and claim on behalf option selecteds', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ claimType: claimType_1.ClaimType.REPRESENTATIVE_CLAIM.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason_1.NotEligibleReason.CLAIM_ON_BEHALF}`));
        });
    });
});
