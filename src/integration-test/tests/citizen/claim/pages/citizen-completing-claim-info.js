"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class CitizenCompletingClaimInfoPage {
    open() {
        I.amOnCitizenAppPage('/claim/completing-claim');
    }
    confirmRead() {
        I.click(buttons.submit);
    }
}
exports.CitizenCompletingClaimInfoPage = CitizenCompletingClaimInfoPage;
