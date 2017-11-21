import * as config from 'config'
import * as toBoolean from 'to-boolean'

export class FeatureToggles {
  static isAnyEnabled (...features: string[]): boolean {
    return features
      .map((feature) => toBoolean(config.get<boolean>(`featureToggles.${feature}`)))
      .some((toggleValue) => toggleValue)
  }
}
