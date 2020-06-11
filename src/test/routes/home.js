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
const cookieName = config.get('session.cookieName');
describe('Home page', () => {
    beforeEach(() => {
        mock.cleanAll();
    });
    describe('on GET', () => {
        it('should redirect to start claim page', async () => {
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            await request(app_1.app)
                .get(paths_1.Paths.homePage.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.receiver.uri));
        });
    });
});
