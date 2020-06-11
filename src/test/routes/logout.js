"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const mock = require("nock");
require("test/routes/expectations");
const paths_1 = require("paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const hooks_1 = require("test/routes/hooks");
const cookieName = config.get('session.cookieName');
describe('Logout receiver', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    beforeEach(() => {
        mock.cleanAll();
    });
    describe('on GET', () => {
        it('should remove session cookie', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            idamServiceMock.resolveInvalidateSession('ABC');
            await request(app_1.app)
                .get(paths_1.Paths.logoutReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.have.cookie(cookieName, ''));
        });
        it('should remove session cookie even when session invalidation is failed ', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            idamServiceMock.rejectInvalidateSession(idamServiceMock.defaultAuthToken, 'bearerToken');
            await request(app_1.app)
                .get(paths_1.Paths.logoutReceiver.uri)
                .set('Cookie', `${cookieName}=${idamServiceMock.defaultAuthToken}`)
                .expect(res => chai_1.expect(res).to.have.cookie(cookieName, ''));
        });
        it('should not remove session cookie or invalidate auth token when session cookie is missing ', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.logoutReceiver.uri)
                .set('Cookie', null)
                .expect(res => chai_1.expect(res).not.to.have.cookie);
        });
    });
});
