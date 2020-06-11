"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("eligibility/paths");
const app_1 = require("main/app");
const pagePath = paths_1.Paths.mcolEligibilityPage.uri;
const expectedTextOnPage = 'You can use the existing MCOL service to claim';
describe('Claim eligibility: Mcol eligibility', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(pagePath)
                .expect(res => chai_1.expect(res).to.be.successful.withText(expectedTextOnPage));
        });
    });
});
