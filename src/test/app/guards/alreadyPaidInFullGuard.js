"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreServiceMock = require("test/http-mocks/claim-store");
require("test/routes/expectations");
const momentFactory_1 = require("shared/momentFactory");
const request = require("supertest");
const app_1 = require("main/app");
const chai_1 = require("chai");
const paths_1 = require("dashboard/paths");
const config = require("config");
const cookieName = config.get('session.cookieName');
function verifyRedirectForGetWhenAlreadyPaidInFull(pagePath, claimOverride = {}) {
    it('should redirect to claim status when claimant declared paid in full', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, claimOverride), { moneyReceivedOn: momentFactory_1.MomentFactory.currentDate() }));
        const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
        await request(app_1.app)
            .get(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantPage
            .evaluateUri({ externalId })));
    });
}
exports.verifyRedirectForGetWhenAlreadyPaidInFull = verifyRedirectForGetWhenAlreadyPaidInFull;
function verifyRedirectForPostWhenAlreadyPaidInFull(pagePath, claimOverride = {}, postBody = {}) {
    it('should redirect to claim status when claimant declared paid in full', async () => {
        claimStoreServiceMock.resolveRetrieveClaimByExternalId(Object.assign(Object.assign({}, claimOverride), { moneyReceivedOn: momentFactory_1.MomentFactory.currentDate() }));
        const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
        await request(app_1.app)
            .post(pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .send(postBody)
            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.defendantPage
            .evaluateUri({ externalId })));
    });
}
exports.verifyRedirectForPostWhenAlreadyPaidInFull = verifyRedirectForPostWhenAlreadyPaidInFull;
