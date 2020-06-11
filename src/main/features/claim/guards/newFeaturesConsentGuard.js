"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("claims/claimStoreClient");
const featureToggles_1 = require("utils/featureToggles");
const guardFactory_1 = require("response/guards/guardFactory");
const paths_1 = require("claim/paths");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
class NewFeaturesConsentGuard {
    static requestHandler() {
        return guardFactory_1.GuardFactory.createAsync(async (req, res) => {
            if (!featureToggles_1.FeatureToggles.isEnabled('newFeaturesConsent')) {
                return true;
            }
            const user = res.locals.user;
            const roles = await claimStoreClient.retrieveUserRoles(user);
            return roles.length !== 0 && roles.some(role => role.includes('cmc-new-features-consent'));
        }, (req, res) => {
            res.redirect(paths_1.Paths.newFeaturesConsentPage.uri);
        });
    }
}
exports.NewFeaturesConsentGuard = NewFeaturesConsentGuard;
