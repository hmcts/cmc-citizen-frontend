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
const pagePath = paths_1.Paths.singleDefendantPage.uri;
const pageRedirect = paths_1.Paths.defendantAddressPage.uri;
const expectedTextOnPage = 'Is this claim against more than one person or organisation?';
describe('Claim eligibility: single defendant page', () => {
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
        it('should redirect to government department page when form is valid and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ singleDefendant: yesNoOption_1.YesNoOption.NO.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ singleDefendant: yesNoOption_1.YesNoOption.YES.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason_1.NotEligibleReason.MULTIPLE_DEFENDANTS}`));
        });
    });
});
