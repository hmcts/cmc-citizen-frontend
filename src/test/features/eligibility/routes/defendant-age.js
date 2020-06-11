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
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
const pagePath = paths_1.Paths.defendantAgePage.uri;
const pageRedirect = paths_1.Paths.over18Page.uri;
const expectedTextOnPage = 'Do you believe the person you’re claiming against is 18 or over?';
const notEligibleReason = notEligibleReason_1.NotEligibleReason.UNDER_18_DEFENDANT;
describe('Claim eligibility: over 18 defendant page', () => {
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
        it('should redirect to claim type page when everything is valid, the defendant is said to be over 18 and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ defendantAge: defendantAgeOption_1.DefendantAgeOption.YES.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to claim type page when form is valid, the defendant is said to a company or organisation and everything is fine', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ defendantAge: defendantAgeOption_1.DefendantAgeOption.COMPANY_OR_ORGANISATION.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(pageRedirect));
        });
        it('should redirect to not eligible page when form is valid and not eligible option selected', async () => {
            await request(app_1.app)
                .post(pagePath)
                .send({ defendantAge: defendantAgeOption_1.DefendantAgeOption.NO.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`${paths_1.Paths.notEligiblePage.uri}?reason=${notEligibleReason}`));
        });
    });
});
