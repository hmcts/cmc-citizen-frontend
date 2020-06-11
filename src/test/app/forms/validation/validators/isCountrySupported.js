"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const isCountrySupported_1 = require("forms/validation/validators/isCountrySupported");
const country_1 = require("common/country");
const nock = require("nock");
const mockPostcodeLookupResponse_1 = require("test/data/entity/mockPostcodeLookupResponse");
const mockCountryLookupResponse_1 = require("test/data/entity/mockCountryLookupResponse");
const mockPostcodeServer = 'https://api.ordnancesurvey.co.uk';
const mockPostcodePath = /\/places\/v1\/addresses\/postcode\?.+/;
const mockCountryServer = 'https://api.ordnancesurvey.co.uk';
const mockCountryPath = /\/opennames\/v1\/find\?.+/;
describe('IsCountrySupported', () => {
    const constraint = new isCountrySupported_1.CheckCountryConstraint();
    describe('validate', () => {
        context('should return true when ', () => {
            it('given an undefined value', async () => {
                chai_1.expect(await constraint.validate(undefined)).to.be.true;
            });
            it('given a null value', async () => {
                chai_1.expect(await constraint.validate(null)).to.be.true;
            });
            it('given an empty string value', async () => {
                chai_1.expect(await constraint.validate('')).to.be.true;
            });
            it('given an invalid postcode', async () => {
                nock(mockPostcodeServer)
                    .get(mockPostcodePath)
                    .reply(404);
                chai_1.expect(await constraint.validate('2SW1AN', validationArgs(country_1.Country.all()))).to.be.true;
            });
            it('the postcode lookup client returns an error', async () => {
                nock(mockPostcodeServer)
                    .get(mockPostcodePath)
                    .reply(500);
                chai_1.expect(await constraint.validate('SW2 1AN', validationArgs(country_1.Country.all()))).to.be.true;
            });
            it('given a valid postcode', async () => {
                nock(mockPostcodeServer)
                    .get(mockPostcodePath)
                    .reply(200, mockPostcodeLookupResponse_1.mockPostcodeLookupResponse);
                nock(mockCountryServer)
                    .get(mockCountryPath)
                    .reply(200, mockCountryLookupResponse_1.mockCountryLookupResponse);
                chai_1.expect(await constraint.validate('SW21AN', validationArgs(country_1.Country.all()))).to.be.true;
            });
        });
        context('should return false when ', () => {
            it('given a postcode that is not in the accepted list', async () => {
                nock(mockPostcodeServer)
                    .get(mockPostcodePath)
                    .reply(200, mockPostcodeLookupResponse_1.mockScottishPostcodeLookupResponse);
                nock(mockCountryServer)
                    .get(mockCountryPath)
                    .reply(200, mockCountryLookupResponse_1.mockScottishCountryLookupResponse);
                chai_1.expect(await constraint.validate('EH9 1SH', validationArgs(country_1.Country.defendantCountries()))).to.be.false;
            });
            it('given an Isle of Man postcode', async () => {
                chai_1.expect(await constraint.validate('IM99 1AD', validationArgs(country_1.Country.defendantCountries()))).to.be.false;
            });
        });
    });
});
function validationArgs(countries) {
    return {
        value: undefined,
        targetName: undefined,
        object: undefined,
        property: undefined,
        constraints: [countries]
    };
}
