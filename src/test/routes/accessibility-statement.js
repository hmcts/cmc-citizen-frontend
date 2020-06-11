"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
require("test/routes/expectations");
const app_1 = require("main/app");
const paths_1 = require("paths");
describe('Accessibility page', () => {
    describe('on GET', () => {
        it('should render accessibility page when everything is fine', async () => {
            await request(app_1.app)
                .get(paths_1.Paths.accessibilityPage.uri)
                .expect(res => chai_1.expect(res).to.be.successful.withText('Accessibility statement for the Online Civil Money Claims service'));
        });
    });
});
