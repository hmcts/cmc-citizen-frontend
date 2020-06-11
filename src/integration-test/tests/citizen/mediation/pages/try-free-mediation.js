"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class TryFreeMediationPage {
    chooseYes() {
        I.checkOption('Yes');
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.click(buttons.submit);
    }
}
exports.TryFreeMediationPage = TryFreeMediationPage;
