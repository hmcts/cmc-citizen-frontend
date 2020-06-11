"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    phoneNumber: 'input[id=number]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantPhonePage {
    enterPhone(phoneNumber) {
        I.fillField(fields.phoneNumber, phoneNumber);
        I.click(buttons.submit);
    }
}
exports.DefendantPhonePage = DefendantPhonePage;
