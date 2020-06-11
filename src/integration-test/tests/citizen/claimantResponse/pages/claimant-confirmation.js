"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    linkGoToYourAccount: 'a[href="/dashboard"]'
};
class ClaimantConfirmation {
    clickGoToYourAccount() {
        I.click(fields.linkGoToYourAccount);
    }
}
exports.ClaimantConfirmation = ClaimantConfirmation;
