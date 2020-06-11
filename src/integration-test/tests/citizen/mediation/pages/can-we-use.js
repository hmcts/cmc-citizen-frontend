"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
const fields = {
    mediationPhoneNumber: 'input[id="mediationPhoneNumber"]',
    optionYes: 'input[id=optionyes]',
    optionNo: 'input[id=optionno]'
};
class CanWeUsePage {
    chooseYes() {
        I.checkOption(fields.optionYes);
        I.click(buttons.submit);
    }
    chooseNo(mediationPhoneNumber) {
        I.checkOption(fields.optionNo);
        I.fillField(fields.mediationPhoneNumber, mediationPhoneNumber);
        I.click(buttons.submit);
    }
}
exports.CanWeUsePage = CanWeUsePage;
