"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    jobTitle: 'input[id="jobTitle"]',
    annualTurnover: 'input[id="annualTurnover"]'
};
const buttons = {
    submit: 'input[id="saveAndContinue"]'
};
class SelfEmploymentPage {
    enterDetails(jobTitle, annualTurnover) {
        I.fillField(fields.jobTitle, jobTitle);
        I.fillField(fields.annualTurnover, annualTurnover.toFixed());
    }
    clickContinue() {
        I.click(buttons.submit);
    }
}
exports.SelfEmploymentPage = SelfEmploymentPage;
