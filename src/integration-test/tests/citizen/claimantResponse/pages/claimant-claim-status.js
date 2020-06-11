"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const viewAndRespondButton = {
    submit: 'input#button'
};
class ClaimantClaimStatusPage {
    viewAndRespondButton() {
        I.click(viewAndRespondButton.submit);
    }
}
exports.ClaimantClaimStatusPage = ClaimantClaimStatusPage;
