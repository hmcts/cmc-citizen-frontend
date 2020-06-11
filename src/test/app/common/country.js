"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const country_1 = require("common/country");
describe('Country', () => {
    describe('valueOf', () => {
        it('should return undefined for unknown country', () => {
            chai.expect(country_1.Country.valueOf('unknown-country')).to.be.undefined;
        });
        it('should return country for known country', () => {
            country_1.Country.all().forEach(country => {
                chai.expect(country_1.Country.valueOf(country.value)).to.be.equal(country);
            });
        });
    });
});
