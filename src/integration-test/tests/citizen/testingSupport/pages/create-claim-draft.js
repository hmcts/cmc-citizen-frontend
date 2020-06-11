"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const buttons = {
    submit: 'input[type=submit]'
};
class CreateClaimDraftPage {
    open() {
        I.amOnCitizenAppPage('/testing-support/create-claim-draft');
    }
    createClaimDraft() {
        I.click(buttons.submit);
    }
}
exports.CreateClaimDraftPage = CreateClaimDraftPage;
