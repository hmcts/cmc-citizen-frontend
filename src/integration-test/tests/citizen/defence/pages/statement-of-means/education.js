"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    value: 'input[id="value"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class EducationPage {
    enterNumberOfChildren(value) {
        I.fillField(fields.value, value.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.EducationPage = EducationPage;
