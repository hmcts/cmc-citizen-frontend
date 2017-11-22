import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class FeatureToggles {
  static isAnyEnabled (...features: string[]): boolean {
    if (features.length === 0) {
      throw new Error('At least one feature name has to be provided')
    }
    return features
      .map((feature) => toBoolean(config.get<boolean>(`featureToggles.${feature}`)))
      .some((toggleValue) => toggleValue)
  }
}
