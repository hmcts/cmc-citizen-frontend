"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const featureToggles_1 = require("utils/featureToggles");
class ClaimFeatureToggles {
    static isFeatureEnabledOnClaim(claim, feature = 'admissions') {
        return featureToggles_1.FeatureToggles.hasAnyAuthorisedFeature(claim.features, feature);
    }
}
exports.ClaimFeatureToggles = ClaimFeatureToggles;
