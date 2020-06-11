"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class StartPage {
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.StartPage = StartPage;
