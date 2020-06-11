"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimFeatureToggles_1 = require("utils/claimFeatureToggles");
class StatementOfMeansFeature {
    static isApplicableFor(claim, draft) {
        if (!claimFeatureToggles_1.ClaimFeatureToggles.isFeatureEnabledOnClaim(claim)) {
            return false;
        }
        if (!draft) {
            throw new Error('Response draft is required');
        }
        const fullAdmissionHasStatementOfMeans = draft.isResponseFullyAdmittedWithPayBySetDate() || draft.isResponseFullyAdmittedWithInstalments();
        const parAdmissionHasStatementOfMeans = draft.isResponsePartiallyAdmittedWithPayBySetDate() || draft.isResponsePartiallyAdmittedWithInstalments();
        return ((draft.isResponseFullyAdmitted() && fullAdmissionHasStatementOfMeans)
            || (draft.isResponsePartiallyAdmitted() && parAdmissionHasStatementOfMeans))
            && !draft.defendantDetails.partyDetails.isBusiness();
    }
}
exports.StatementOfMeansFeature = StatementOfMeansFeature;
