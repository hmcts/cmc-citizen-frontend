"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    requestMoreTime: {
        yes: 'input[id=optionyes]',
        no: 'input[id=optionno]'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantMoreTimeRequestPage {
    chooseYes() {
        I.checkOption(fields.requestMoreTime.yes);
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption(fields.requestMoreTime.no);
        I.click(buttons.submit);
    }
}
exports.DefendantMoreTimeRequestPage = DefendantMoreTimeRequestPage;
