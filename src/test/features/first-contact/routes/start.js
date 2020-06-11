"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const paths_1 = require("first-contact/paths");
const app_1 = require("main/app");
describe('Defendant first contact: start page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        it('should render page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.startPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Respond to a money claim'));
        });
    });
});
