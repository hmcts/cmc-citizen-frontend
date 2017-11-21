import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { NotFoundError } from '../../../errors'
import { FeatureToggles } from 'utils/featureToggles'

export class FeatureToggleGuard {
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
