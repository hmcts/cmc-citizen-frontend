"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    addressLine1: 'input[id="address[line1]"]',
    addressLine2: 'input[id="address[line2]"]',
    addressCity: 'input[id="address[city]"]',
    postcode: 'input[id="address[postcode]"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantAddressPage {
    enterAddress(address) {
        I.fillField(fields.addressLine1, address.line1);
        I.fillField(fields.addressLine2, address.line2);
        I.fillField(fields.addressCity, address.city);
        I.fillField(fields.postcode, address.postcode);
        I.click(buttons.submit);
    }
}
exports.DefendantAddressPage = DefendantAddressPage;
