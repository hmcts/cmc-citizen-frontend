import * as express from 'express'
import { GuardFactory } from 'features/response/guards/guardFactory'
import { NotFoundError } from 'errors'
import { FeatureToggles } from 'utils/featureToggles'

export class FeatureToggleGuard {
  /**
   * Throws NotFound error when feature is toggled off
   *
   * @param {string} feature feature name
   * @returns {express.RequestHandler} - request handler middleware
   */
  static featureEnabledGuard (feature: string): express.RequestHandler {
    return GuardFactory.createAsync(
      async (req: express.Request, res: express.Response) => FeatureToggles.hasAuthorisedFeature(feature, res.locals.claim.features),
      (req: express.Request, res: express.Response): void => {
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
    return GuardFactory.createAsync(
      async (req: express.Request, res: express.Response) => FeatureToggles.hasAnyAuthorisedFeature(res.locals.claim.features, ...features),
      (req: express.Request, res: express.Response): void => {
        throw new NotFoundError(req.path)
      })
  }
}
