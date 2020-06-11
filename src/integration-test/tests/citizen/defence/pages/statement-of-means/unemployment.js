"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    retired: 'input[id="optionRETIRED"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class UnemploymentPage {
    selectRetired() {
        I.checkOption(fields.retired);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.UnemploymentPage = UnemploymentPage;
