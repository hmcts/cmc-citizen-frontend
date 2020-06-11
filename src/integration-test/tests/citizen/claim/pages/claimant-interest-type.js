"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    optionSame: 'input[id=optionsame]',
    optionBreakdown: 'input[id=optionbreakdown]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestTypePage {
    selectSameRate() {
        I.checkOption(fields.optionSame);
        I.click(buttons.submit);
    }
    selectBreakdown() {
        I.checkOption(fields.optionBreakdown);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestTypePage = ClaimantInterestTypePage;
