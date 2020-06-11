"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config = require("config");
const mock = require("nock");
const request = require("supertest");
const paths_1 = require("eligibility/paths");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const cookieName = config.get('session.cookieName');
function checkEligibilityGuards(app, method, pagePath) {
    it('should redirect to eligibility start page when draft is not marked eligible', async () => {
        mock.cleanAll();
        idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        idamServiceMock.resolveRetrieveServiceToken();
        draftStoreServiceMock.resolveFind('claim', { eligibility: undefined });
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).redirect.toLocation(paths_1.Paths.startPage.uri));
    });
}
exports.checkEligibilityGuards = checkEligibilityGuards;
