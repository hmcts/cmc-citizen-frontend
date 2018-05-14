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
    return GuardFactory.create(() => FeatureToggles.isEnabled(feature), (req: express.Request, res: express.Response): void => {
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
    return GuardFactory.create(() => FeatureToggles.isAnyEnabled(...features), (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }
}
