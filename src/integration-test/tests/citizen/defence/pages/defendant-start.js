"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input.button.button-start'
};
class DefendantStartPage {
    open() {
        I.amOnCitizenAppPage('/first-contact/start');
    }
    start() {
        I.click(buttons.submit);
    }
}
exports.DefendantStartPage = DefendantStartPage;
