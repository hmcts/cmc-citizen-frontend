"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const address_1 = require("forms/models/address");
const address_2 = require("claims/models/address");
const address_3 = require("claims/converters/address");
const validationUtils_1 = require("test/app/forms/models/validationUtils");
describe('Address converter', () => {
    context('should convert form address model to address model', () => {
        it('when all fields populated', () => {
            const formAddress = new address_1.Address(validationUtils_1.generateString(10), validationUtils_1.generateString(10), validationUtils_1.generateString(10), validationUtils_1.generateString(6));
            const actual = address_3.convertAddress(formAddress);
            expectAllFieldsMappedCorrectly(formAddress, actual);
        });
        it('when all fields empty', () => {
            const formAddress = new address_1.Address();
            const actual = address_3.convertAddress(formAddress);
            expectAllFieldsMappedCorrectly(formAddress, actual);
        });
        it('when instance of Object given', () => {
            const formAddress = {};
            const actual = address_3.convertAddress(formAddress);
            expectAllFieldsMappedCorrectly(formAddress, actual);
        });
    });
});
function expectAllFieldsMappedCorrectly(expected, actual) {
    chai_1.expect(actual).to.be.instanceof(address_2.Address);
    chai_1.expect(actual.line1).to.be.equal(expected.line1);
    chai_1.expect(actual.line2).to.be.equal(expected.line2);
    chai_1.expect(actual.line3).to.be.equal(expected.line3);
    chai_1.expect(actual.postcode).to.be.equal(expected.postcode);
    chai_1.expect(actual.city).to.be.equal(expected.city);
}
