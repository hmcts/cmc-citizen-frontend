"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    isCohabiting: 'input[id=optionyes]',
    notCohabiting: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class PartnerPage {
    selectYesOption() {
        I.checkOption(fields.isCohabiting);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.notCohabiting);
        I.click(buttons.submit);
    }
}
exports.PartnerPage = PartnerPage;
