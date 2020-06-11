"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
function checkNotClaimantInCaseGuard(app, method, pagePath) {
    it(`for ${method} should return 403 and render forbidden error page not claimant in case`, async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
        idamServiceMock.resolveRetrieveUserFor('4', 'citizen');
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.forbidden.withText('Forbidden'));
    });
}
exports.checkNotClaimantInCaseGuard = checkNotClaimantInCaseGuard;
