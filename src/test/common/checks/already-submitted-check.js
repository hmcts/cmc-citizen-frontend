"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
require("test/routes/expectations");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("dashboard/paths");
const cookieName = config.get('session.cookieName');
function checkAlreadySubmittedGuard(app, method, pagePath) {
    it('should return 500 and render error page when cannot retrieve claim in guard', async () => {
        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
    });
    it('should redirect to your dashboard page when defendant has already responded', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalIdWithResponse();
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.dashboardPage.uri));
    });
}
exports.checkAlreadySubmittedGuard = checkAlreadySubmittedGuard;
