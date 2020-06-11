"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
function checkOnlyClaimantHasAccess(app, method, pagePath) {
    it(`for ${method} should return 403 and render forbidden error page when user is not claimant on the case`, async () => {
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ submitterId: '999', defendantId: '1' });
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.forbidden.withText('Forbidden'));
    });
}
exports.checkOnlyClaimantHasAccess = checkOnlyClaimantHasAccess;
