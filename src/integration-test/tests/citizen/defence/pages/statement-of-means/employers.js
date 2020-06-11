"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    employerName: 'input[id="rows[0][employerName]"]',
    jobTitle: 'input[id="rows[0][jobTitle]"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class EmployersPage {
    enterDetails(employerName, jobTitle) {
        I.fillField(fields.employerName, employerName);
        I.fillField(fields.jobTitle, jobTitle);
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.EmployersPage = EmployersPage;
