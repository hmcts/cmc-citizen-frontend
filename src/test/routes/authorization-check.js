"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const mock = require("nock");
require("test/routes/expectations");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
exports.defaultAccessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login\\?response_type=code&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&client_id=cmc_citizen&redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver`);
function checkAuthorizationGuards(app, method, pagePath, accessDeniedPage = exports.defaultAccessDeniedPagePattern) {
    it('should redirect to access denied page when JWT token is missing', async () => {
        await request(app)[method](pagePath)
            .expect(res => chai_1.expect(res).redirect.toLocation(accessDeniedPage));
    });
    it('should redirect to access denied page when cannot retrieve user details (possibly session expired)', async () => {
        mock.cleanAll();
        idamServiceMock.rejectRetrieveUserFor('Response 403 from /details');
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).redirect.toLocation(accessDeniedPage));
    });
    it('should redirect to access denied page when user not in required role', async () => {
        mock.cleanAll();
        idamServiceMock.resolveRetrieveUserFor('1', 'divorce-private-beta');
        await request.agent(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).redirect.toLocation(accessDeniedPage));
    });
}
exports.checkAuthorizationGuards = checkAuthorizationGuards;
