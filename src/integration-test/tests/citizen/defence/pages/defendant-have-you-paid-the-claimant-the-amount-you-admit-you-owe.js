"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    yes: 'input[id=optionyes]',
    no: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage {
    selectYesOption() {
        I.checkOption(fields.yes);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.no);
        I.click(buttons.submit);
    }
}
exports.DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage = DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage;
