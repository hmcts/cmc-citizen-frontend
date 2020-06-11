"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const I = actor();
const fields = {
    amountBreakdown: 'Details'
};
class DashboardClaimDetails {
    clickViewClaim() {
        I.click('View claim');
    }
    checkClaimData(claimReference, claimData) {
        I.see(claimReference);
        I.see(claimData.total);
        I.see(claimData.reason);
        I.click(fields.amountBreakdown);
        I.see('Claim amount');
        I.see(claimData.total);
        I.click('Download claim');
    }
}
exports.DashboardClaimDetails = DashboardClaimDetails;
