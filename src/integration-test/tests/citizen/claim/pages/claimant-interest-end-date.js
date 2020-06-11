"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    optionSubmission: 'input[id=optionsubmission]',
    optionSettledOrJudgment: 'input[id=optionsettled_or_judgment]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class ClaimantInterestEndDatePage {
    selectSubmission() {
        I.checkOption(fields.optionSubmission);
        I.click(buttons.submit);
    }
    selectSettledOrJudgment() {
        I.checkOption(fields.optionSettledOrJudgment);
        I.click(buttons.submit);
    }
}
exports.ClaimantInterestEndDatePage = ClaimantInterestEndDatePage;
