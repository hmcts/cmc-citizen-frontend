"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    optionStandard: 'input[id=typestandard]',
    optionDifferent: 'input[id=typedifferent]',
    dailyAmount: 'input[id="dailyAmount"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestHowMuchPage {
    selectStandardRate() {
        I.checkOption(fields.optionStandard);
        I.click(buttons.submit);
    }
    selectDifferent(dailyAmount) {
        I.checkOption(fields.optionDifferent);
        I.fillField(fields.dailyAmount, dailyAmount);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestHowMuchPage = ClaimantInterestHowMuchPage;
