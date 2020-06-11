"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
const service_1 = require("models/service");
describe('Returning user: No claim number', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.noClaimNumberPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Which service did you use to view or make the claim?'));
        });
    });
    describe('on POST', () => {
        it('should render page when form is invalid and everything is fine', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.noClaimNumberPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Which service did you use to view or make the claim?', 'div class="error-summary"'));
        });
        it('should redirect to home page when moneyclaims service is picked', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.noClaimNumberPage.uri)
                .send({ service: service_1.Service.MONEYCLAIMS.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.homePage.uri));
        });
        it('should redirect to mcol when mcol service is picked', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.noClaimNumberPage.uri)
                .send({ service: service_1.Service.MCOL.option })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(config.get('mcol.url')));
        });
    });
});
