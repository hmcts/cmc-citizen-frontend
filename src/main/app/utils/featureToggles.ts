import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('FeatureToggles')

export class FeatureToggles {
  static isEnabled (featureName: string): boolean {
    return FeatureToggles.isAnyEnabled(featureName)
  }

  static hasAnyAuthorisedFeature (authorisedFeatures: string[], ...features: string[]): boolean {
    if (features.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }
    const result = features
      .some((feature) => FeatureToggles.isEnabled(feature)
        && authorisedFeatures !== undefined && authorisedFeatures.includes(feature))
    logger.info('hasAnyAuthorisedFeature(' + features + '): ' + result)
    return result

  }

  static isAnyEnabled (...featureNames: string[]): boolean {
    if (featureNames.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }
    const result = featureNames.some((featureName) => toBoolean(config.get<boolean>(`featureToggles.${featureName}`)))
    logger.info('isAnyEnabled(' + featureNames + '):' + result)
    return result
  }
}
