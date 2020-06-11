"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    hasPension: 'input[id=optionyes]',
    noPension: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class PartnerPensionPage {
    selectYesOption() {
        I.checkOption(fields.hasPension);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.noPension);
        I.click(buttons.submit);
    }
}
exports.PartnerPensionPage = PartnerPensionPage;
