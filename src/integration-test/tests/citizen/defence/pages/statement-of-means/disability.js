"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    isDisabled: 'input[id=optionyes]',
    notDisabled: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DisabilityPage {
    selectYesOption() {
        I.checkOption(fields.isDisabled);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.notDisabled);
        I.click(buttons.submit);
    }
}
exports.DisabilityPage = DisabilityPage;
