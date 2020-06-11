"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const guardFactory_1 = require("features/response/guards/guardFactory");
const errors_1 = require("errors");
const featureToggles_1 = require("utils/featureToggles");
class OptInFeatureToggleGuard {
    /**
     * This looks for feature being enabled in config as well as
     * check for user consent by checking feature being present in claim's allowed features.
     *
     * @param {string} feature feature name
     * @returns {express.RequestHandler} - request handler middleware
     */
    static featureEnabledGuard(feature) {
        return guardFactory_1.GuardFactory.create((res) => featureToggles_1.FeatureToggles.hasAnyAuthorisedFeature(res.locals.claim.features, feature), (req, res) => {
            throw new errors_1.NotFoundError(req.path);
        });
    }
}
exports.OptInFeatureToggleGuard = OptInFeatureToggleGuard;
