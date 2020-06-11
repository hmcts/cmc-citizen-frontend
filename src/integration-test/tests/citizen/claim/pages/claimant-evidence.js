"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    type: 'rows[0][type]',
    description: 'rows[0][description]'
};
const buttons = {
    submit: 'saveAndContinue'
};
class ClaimantEvidencePage {
    enterEvidenceRow(type, description) {
        I.selectOption(fields.type, type);
        I.fillField(fields.description, description);
        I.click(buttons.submit);
    }
}
exports.ClaimantEvidencePage = ClaimantEvidencePage;
