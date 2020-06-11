"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    hasDisabledDependant: 'input[id=optionyes]',
    noDisabledDependant: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DependantDisabilityPage {
    selectYesOption() {
        I.checkOption(fields.hasDisabledDependant);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.noDisabledDependant);
        I.click(buttons.submit);
    }
}
exports.DependantDisabilityPage = DependantDisabilityPage;
