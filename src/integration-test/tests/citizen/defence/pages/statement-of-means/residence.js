"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    options: {
        ownHome: 'input[id="typeOWN_HOME"]',
        other: 'input[id="typeOTHER"]'
    },
    housingDetails: 'input[id="housingDetails"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class ResidencePage {
    selectOwnHome() {
        I.checkOption(fields.options.ownHome);
    }
    selectOther(housingDetails) {
        I.checkOption(fields.options.other);
        I.fillField(fields.housingDetails, housingDetails);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.ResidencePage = ResidencePage;
