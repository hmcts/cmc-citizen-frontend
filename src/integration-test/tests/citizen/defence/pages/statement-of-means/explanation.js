"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    text: 'textarea[id=text]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class ExplanationPage {
    enterExplanation(text) {
        I.fillField(fields.text, text);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.ExplanationPage = ExplanationPage;
