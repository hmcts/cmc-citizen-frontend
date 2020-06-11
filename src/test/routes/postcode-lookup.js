"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const chai_1 = require("chai");
const app_1 = require("main/app");
const paths_1 = require("paths");
require("test/routes/expectations");
const mock = require("nock");
const mockPostcodeLookupResponse_1 = require("../data/entity/mockPostcodeLookupResponse");
describe('PostCode Lookup', () => {
    const mockPostcodeServer = 'https://api.ordnancesurvey.co.uk';
    const mockPostcodePath = /\/places\/v1\/addresses\/postcode\?.+/;
    it('should return correct address when postCode lookup is used', async () => {
        mock(mockPostcodeServer)
            .get(mockPostcodePath)
            .reply(200, mockPostcodeLookupResponse_1.mockPostcodeLookupResponse);
        await request(app_1.app)
            .get(paths_1.Paths.postcodeLookupProxy.uri)
            .query({ 'postcode': 'SW2 1AN' })
            .expect(res => chai_1.expect(res).to.be.successful.withText('DALBERG ROAD'));
    });
    it('should produce appinsights custom event when Ordnance Survey keys stopped working', async () => {
        mock(mockPostcodeServer)
            .get(mockPostcodePath)
            .reply(401, 'Authentication failed');
        await request(app_1.app)
            .get(paths_1.Paths.postcodeLookupProxy.uri)
            .query({ 'postcode': 'SW2 1AN' })
            .expect(res => chai_1.expect(res).to.serverError.withText('Authentication failed'));
    });
});
