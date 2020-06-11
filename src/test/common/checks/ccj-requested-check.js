"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("dashboard/paths");
const cookieName = config.get('session.cookieName');
function checkCountyCourtJudgmentRequestedGuard(app, method, pagePath) {
    it(`for ${method} should redirect to your dashboard page when claimant has already requested CCJ`, async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId({ countyCourtJudgmentRequestedAt: '2017-10-10' });
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.dashboardPage.uri));
    });
}
exports.checkCountyCourtJudgmentRequestedGuard = checkCountyCourtJudgmentRequestedGuard;
