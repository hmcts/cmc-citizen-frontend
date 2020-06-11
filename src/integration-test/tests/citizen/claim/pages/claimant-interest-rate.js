"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    optionStandard: 'input[id=typestandard]',
    optionDifferent: 'input[id=typedifferent]',
    differentRate: 'input[id="rate[label]"]',
    differentRateReason: 'input[id="reason[label]"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestRatePage {
    selectStandardRate() {
        I.checkOption(fields.optionStandard);
        I.click(buttons.submit);
    }
    selectDifferent(rate, reason) {
        I.checkOption(fields.optionDifferent);
        I.fillField(fields.differentRate, rate);
        I.fillField(fields.differentRateReason, reason);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestRatePage = ClaimantInterestRatePage;
