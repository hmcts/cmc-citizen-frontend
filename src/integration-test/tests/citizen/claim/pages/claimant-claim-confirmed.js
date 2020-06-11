"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    claimReference: 'div.reference-number > h1.bold-large'
};
class ClaimantClaimConfirmedPage {
    getClaimReference() {
        return I.grabTextFrom(fields.claimReference);
    }
}
exports.ClaimantClaimConfirmedPage = ClaimantClaimConfirmedPage;
