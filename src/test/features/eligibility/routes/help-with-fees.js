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
const yesNoOption_1 = require("models/yesNoOption");
const pagePath = paths_1.Paths.helpWithFeesPage.uri;
const pageRedirect = paths_1.Paths.singleDefendantPage.uri;
const expectedTextOnPage = 'Do you need help paying your court fees?';
const notEligibleReason = notEligibleReason_1.NotEligibleReason.HELP_WITH_FEES;
describe('Claim eligibility: help with fees page', () => {
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
        it('should redirect to claimant address page when form is valid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ helpWithFees: yesNoOption_1.YesNoOption.NO.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ helpWithFees: yesNoOption_1.YesNoOption.YES.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason}`));
        });
    });
});
