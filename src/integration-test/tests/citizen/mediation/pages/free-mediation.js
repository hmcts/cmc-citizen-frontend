"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class FreeMediationPage {
    clickHowFreeMediationWorks() {
        I.click(buttons.submit);
    }
}
exports.FreeMediationPage = FreeMediationPage;
