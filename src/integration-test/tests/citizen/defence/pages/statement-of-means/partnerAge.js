"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    isAdult: 'input[id=optionyes]',
    notAdult: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class PartnerAgePage {
    selectYesOption() {
        I.checkOption(fields.isAdult);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.notAdult);
        I.click(buttons.submit);
    }
}
exports.PartnerAgePage = PartnerAgePage;
