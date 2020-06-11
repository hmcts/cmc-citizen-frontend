"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    date: 'rows[0][date]',
    description: 'rows[0][description]'
};
const buttons = {
    submit: 'saveAndContinue'
};
class ClaimantTimelinePage {
    enterTimelineRow(date, description) {
        I.fillField(fields.date, date);
        I.fillField(fields.description, description);
        I.click(buttons.submit);
    }
}
exports.ClaimantTimelinePage = ClaimantTimelinePage;
