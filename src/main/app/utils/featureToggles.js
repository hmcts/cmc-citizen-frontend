"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const toBoolean = require("to-boolean");
class FeatureToggles {
    static isEnabled(featureName) {
        return FeatureToggles.isAnyEnabled(featureName);
    }
    static hasAnyAuthorisedFeature(authorisedFeatures, ...features) {
        if (features.length === 0) {
            throw new Error('At least one feature name has to be provided');
        }
        return features
            .some((feature) => FeatureToggles.isEnabled(feature)
            && authorisedFeatures !== undefined && authorisedFeatures.includes(feature));
    }
    static isAnyEnabled(...featureNames) {
        if (featureNames.length === 0) {
            throw new Error('At least one feature name has to be provided');
        }
        return featureNames
            .some((featureName) => toBoolean(config.get(`featureToggles.${featureName}`)));
    }
}
exports.FeatureToggles = FeatureToggles;
