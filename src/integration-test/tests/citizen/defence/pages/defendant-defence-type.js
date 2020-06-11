"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantDefenceTypePage {
    admitAllOfMoneyClaim() {
        I.checkOption('I admit all of the claim');
        I.click(buttons.submit);
    }
    admitPartOfMoneyClaim() {
        I.checkOption('I admit part of the claim');
        I.click(buttons.submit);
    }
    rejectAllOfMoneyClaim() {
        I.checkOption('I reject all of the claim');
        I.click(buttons.submit);
    }
}
exports.DefendantDefenceTypePage = DefendantDefenceTypePage;
