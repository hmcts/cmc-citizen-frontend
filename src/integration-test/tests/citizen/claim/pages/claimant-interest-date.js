"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    typeSubmission: 'input[id=typesubmission]',
    typeCustom: 'input[id=typecustom]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestDatePage {
    selectSubmission() {
        I.checkOption(fields.typeSubmission);
        I.click(buttons.submit);
    }
    selectCustom() {
        I.checkOption(fields.typeCustom);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestDatePage = ClaimantInterestDatePage;
