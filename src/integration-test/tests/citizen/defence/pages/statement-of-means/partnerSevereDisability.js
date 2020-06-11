"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    isSeverelyDisabled: 'input[id=optionyes]',
    notSeverelyDisabled: 'input[id=optionno]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class PartnerSevereDisabilityPage {
    selectYesOption() {
        I.checkOption(fields.isSeverelyDisabled);
        I.click(buttons.submit);
    }
    selectNoOption() {
        I.checkOption(fields.notSeverelyDisabled);
        I.click(buttons.submit);
    }
}
exports.PartnerSevereDisabilityPage = PartnerSevereDisabilityPage;
