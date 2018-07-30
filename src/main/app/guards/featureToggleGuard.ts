import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import { GuardFactory } from 'features/response/guards/guardFactory'
import { NotFoundError } from 'errors'

export class FeatureToggleGuard {
  /**
   * Throws NotFound error when feature is toggled off
   *
   * @param {string} feature feature name
   * @returns {express.RequestHandler} - request handler middleware
   */
  static featureEnabledGuard (feature: string): express.RequestHandler {
    return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {

      return toBoolean(config.get<boolean>(`featureToggles.${feature}`))
        && res.locals.claim.features.indexOf(feature) > -1
    }, (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }

  /**
   * Throws NotFound error when all features are toggled off
   *
   * @param {string} features a list of toggle names
   * @returns {express.RequestHandler} - request handler middleware
   */
  static anyFeatureEnabledGuard (...features: string[]): express.RequestHandler {
    return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {

      return features
        .some((feature) => toBoolean(config.get<boolean>(`featureToggles.${feature}`))
          && res.locals.claim.features.indexOf(feature) > -1
        )
    }, (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }
}
