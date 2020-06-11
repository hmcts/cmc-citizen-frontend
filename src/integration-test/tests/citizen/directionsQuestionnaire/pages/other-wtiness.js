"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    howMany: 'input[id="howMany"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class OtherWitnessPage {
    chooseYes() {
        I.checkOption('Yes');
        I.fillField(fields.howMany, '1');
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.click(buttons.submit);
    }
}
exports.OtherWitnessPage = OtherWitnessPage;
