"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    acceptCourtCalculator: {
        yes: 'input[id=acceptyes]',
        no: 'input[id=acceptno]'
    }
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantCourtOfferedSetDatePage {
    accept() {
        I.checkOption(fields.acceptCourtCalculator.yes);
        I.click(buttons.submit);
    }
    reject() {
        I.checkOption(fields.acceptCourtCalculator.no);
        I.click(buttons.submit);
    }
}
exports.ClaimantCourtOfferedSetDatePage = ClaimantCourtOfferedSetDatePage;
