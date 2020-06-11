"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("first-contact/paths");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const app_1 = require("main/app");
describe('Defendant first contact: claim reference page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.claimReferencePage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Enter your claim number'));
        });
    });
    describe('on POST', () => {
        it('should render page when form is invalid and everything is fine', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.claimReferencePage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Enter your claim number', 'div class="error-summary"'));
        });
        it('should redirect to pin validation page when form is valid and everything is fine', async () => {
            const redirectPattern = new RegExp(`${config.get('idam.authentication-web.url')}/login/pin\\?.+redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver`);
            claimStoreServiceMock.resolveIsClaimLinked(false);
            await request(app_1.app)
                .post(paths_1.Paths.claimReferencePage.uri)
                .send({ reference: '000MC001' })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(redirectPattern));
        });
        it('should redirect to mcol when CCBC prefix is used', async () => {
            await request(app_1.app)
                .post(paths_1.Paths.claimReferencePage.uri)
                .send({ reference: 'A1ED1123' })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(config.get('mcol.url')));
        });
        it('should redirect to "/" when form is valid and claim has already been linked', async () => {
            claimStoreServiceMock.resolveIsClaimLinked(true);
            await request(app_1.app)
                .post(paths_1.Paths.claimReferencePage.uri)
                .send({ reference: '000MC001' })
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation('/'));
        });
        it('should return 500 and render error page when cannot check claim status', async () => {
            claimStoreServiceMock.rejectIsClaimLinked();
            await request(app_1.app)
                .post(paths_1.Paths.claimReferencePage.uri)
                .send({ reference: '000MC001' })
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
    });
});
