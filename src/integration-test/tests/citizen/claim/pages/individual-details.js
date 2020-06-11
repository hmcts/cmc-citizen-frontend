"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_data_1 = require("integration-test/data/test-data");
const I = actor();
const fields = {
    name: 'input[id=name]',
    title: 'input[id=title]',
    firstName: 'input[id=firstName]',
    lastName: 'input[id=lastName]',
    address: {
        postcodeLookUp: 'input[id="address[postcodeLookup]"]',
        selectAddressList: 'select[id="address[addressList]"]',
        line1: 'input[id="address[line1]"]',
        line2: 'input[id="address[line2]"]',
        city: 'input[id="address[city]"]',
        postcode: 'input[id="address[postcode]"]',
        enterManually: 'a[id="address[enterManually]"]'
    },
    hasCorrespondenceAddress: 'input[id=hasCorrespondenceAddresstrue]',
    correspondenceAddress: {
        line1: 'input[id="correspondenceAddress[line1]"]',
        line2: 'input[id="correspondenceAddress[line2]"]',
        city: 'input[id="correspondenceAddress[city]"]',
        postcode: 'input[id="correspondenceAddress[postcode]"]',
        enterManually: 'a[id="correspondenceAddress[enterManually]"]'
    }
};
const buttons = {
    submit: 'input[type=submit]',
    postCodeLookUp: 'a[id="address[find-button]"]'
};
class IndividualDetailsPage {
    open(type) {
        I.amOnCitizenAppPage(`/claim/${type}-individual-details`);
    }
    enterName(name) {
        I.fillField(fields.name, name);
    }
    enterTitle(title) {
        I.fillField(fields.title, title);
    }
    enterFirstName(firstName) {
        I.fillField(fields.firstName, firstName);
    }
    enterLastName(lastName) {
        I.fillField(fields.lastName, lastName);
    }
    lookupAddress(postcodeLookupQuery) {
        I.fillField(fields.address.postcodeLookUp, postcodeLookupQuery.postcode);
        I.click(buttons.postCodeLookUp);
        I.waitForVisible(fields.address.selectAddressList);
        I.click(fields.address.selectAddressList);
        I.selectOption(fields.address.selectAddressList, postcodeLookupQuery.address);
    }
    enterAddress(address, clickManualLink = true) {
        if (clickManualLink) {
            I.click(fields.address.enterManually);
        }
        I.fillField(fields.address.line1, address.line1);
        I.fillField(fields.address.line2, address.line2);
        I.fillField(fields.address.postcode, address.postcode);
        I.fillField(fields.address.city, address.city);
    }
    enterAddresses(address, correspondenceAddress) {
        this.lookupAddress(test_data_1.postcodeLookupQuery);
        I.checkOption(fields.hasCorrespondenceAddress);
        I.click(fields.correspondenceAddress.enterManually);
        I.fillField(fields.correspondenceAddress.line1, correspondenceAddress.line1);
        I.fillField(fields.correspondenceAddress.line2, correspondenceAddress.line2);
        I.fillField(fields.correspondenceAddress.city, correspondenceAddress.city);
        I.fillField(fields.correspondenceAddress.postcode, correspondenceAddress.postcode);
    }
    submit() {
        I.click(buttons.submit);
    }
}
exports.IndividualDetailsPage = IndividualDetailsPage;
