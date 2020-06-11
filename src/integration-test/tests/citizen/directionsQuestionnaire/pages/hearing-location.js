"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    alternativeCourtName: 'input[id="alternativeCourtName"]',
    enterACourtName: 'input[id="alternativeOptionname"]'
};
const buttons = {
    submit: 'input[type=submit]'
};
class HearingLocationPage {
    chooseYes() {
        I.checkOption('Yes');
        I.click(buttons.submit);
    }
    chooseNo() {
        I.checkOption('No');
        I.waitForElement('#alternativeOptionname');
        I.checkOption(fields.enterACourtName);
        I.fillField(fields.alternativeCourtName, 'My own court where i am the judge');
        I.click(buttons.submit);
    }
    chooseNoAsClaimant() {
        I.checkOption('No');
        I.click(buttons.submit);
    }
}
exports.HearingLocationPage = HearingLocationPage;
