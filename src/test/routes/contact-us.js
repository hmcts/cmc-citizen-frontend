"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
describe('Contact us page', () => {
    describe('on GET', () => {
        it('should render cookies page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.contactUsPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Contact us'));
        });
    });
});
