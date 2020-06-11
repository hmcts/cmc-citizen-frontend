"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    type: 'rows[0][type]',
    description: 'rows[0][description]',
    comment: 'comment'
};
const buttons = {
    submit: 'saveAndContinue'
};
class DefendantEvidencePage {
    enterEvidenceRow(type, description, comment) {
        I.selectOption(fields.type, type);
        I.fillField(fields.description, description);
        I.fillField(fields.comment, comment);
        I.click(buttons.submit);
    }
}
exports.DefendantEvidencePage = DefendantEvidencePage;
