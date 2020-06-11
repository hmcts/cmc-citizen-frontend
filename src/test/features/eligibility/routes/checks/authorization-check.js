"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const mock = require("nock");
require("test/routes/expectations");
const idamServiceMock = require("test/http-mocks/idam");
const cookieName = config.get('session.cookieName');
function checkAuthorizationMiddleware(app, method, pagePath) {
    it('should render page when user session expired', async () => {
        mock.cleanAll();
        idamServiceMock.rejectRetrieveUserFor('Response 403 from /details');
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.successful);
    });
    it('should render page when user session is active', async () => {
        mock.cleanAll();
        idamServiceMock.resolveRetrieveUserFor('1');
        await request(app)[method](pagePath)
            .set('Cookie', `${cookieName}=ABC`)
            .expect(res => chai_1.expect(res).to.be.successful);
    });
}
exports.checkAuthorizationMiddleware = checkAuthorizationMiddleware;
