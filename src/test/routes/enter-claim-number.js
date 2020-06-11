"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
describe('Returning user: Enter claim number', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.enterClaimNumberPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Enter your claim number'));
        });
    });
    describe('on POST', () => {
        it('should render page when form is invalid and everything is fine', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.enterClaimNumberPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'));
        });
        it('should redirect to home page when form is valid and everything is fine', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.enterClaimNumberPage.uri)
                .send({ reference: '000MC001' })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.homePage.uri));
        });
        it('should redirect to mcol when ccbc prefix is used', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.enterClaimNumberPage.uri)
                .send({ reference: 'A1BA1123' })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(config.get('mcol.url')));
        });
        it('should render the page when invalid reference is used', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.enterClaimNumberPage.uri)
                .send({ reference: '1234567' })
                .expect(res => chai_1.expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'));
        });
    });
});
