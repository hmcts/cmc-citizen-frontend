"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
describe('Terms and Conditions page', () => {
    describe('on GET', () => {
        it('should render the Terms and conditions page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.termsAndConditionsPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('By using this service you’re agreeing to the following terms of use.'));
        });
    });
});
