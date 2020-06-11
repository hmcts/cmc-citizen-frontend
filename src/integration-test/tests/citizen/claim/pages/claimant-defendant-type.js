"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantDefendantTypePage {
    open() {
        I.amOnCitizenAppPage('/claim/defendant-type');
    }
    chooseIndividual() {
        I.checkOption('Individual');
        I.click(buttons.submit);
    }
}
exports.ClaimantDefendantTypePage = ClaimantDefendantTypePage;
