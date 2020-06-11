"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    claimReference: 'input#reference'
};
const buttons = {
    submit: 'input[type=submit]'
};
class DefendantEnterClaimReferencePage {
    open() {
        I.amOnCitizenAppPage('/first-contact/claim-reference');
    }
    enterClaimReference(claimReference) {
        I.fillField(fields.claimReference, claimReference);
        I.click(buttons.submit);
    }
}
exports.DefendantEnterClaimReferencePage = DefendantEnterClaimReferencePage;
