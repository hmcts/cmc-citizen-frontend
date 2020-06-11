"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    date: 'input[id="rows[x][date]"]',
    description: 'textarea[id="rows[y][description]"]'
};
class DefendantTimelineEventsPage {
    enterTimelineEvent(eventNum, date, description) {
        const fieldDate = fields.date.replace('x', eventNum.toString());
        const fieldDescription = fields.description.replace('y', eventNum.toString());
        I.fillField(fieldDate, date);
        I.fillField(fieldDescription, description);
    }
    submitForm() {
        I.click('Save and continue');
    }
}
exports.DefendantTimelineEventsPage = DefendantTimelineEventsPage;
