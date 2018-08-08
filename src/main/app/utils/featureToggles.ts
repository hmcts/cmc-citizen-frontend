import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class FeatureToggles {
  static isEnabled (featureName: string): boolean {
    return FeatureToggles.isAnyEnabled(featureName)
  }

  static hasAuthorisedFeature (feature: string, authorisedFeatures: string[]): boolean {
    return FeatureToggles.hasAnyAuthorisedFeature(authorisedFeatures, feature)
  }

  static hasAnyAuthorisedFeature (authorisedFeatures: string[], ...features: string[]): boolean {
    if (features.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }

    return features
      .some((feature) => toBoolean(config.get<boolean>(`featureToggles.${feature}`))
        && authorisedFeatures.includes(feature))

  }

  static isAnyEnabled (...featureNames: string[]): boolean {
    if (featureNames.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }
    return featureNames
      .some((featureName) => toBoolean(config.get<boolean>(`featureToggles.${featureName}`)))
  }
}
