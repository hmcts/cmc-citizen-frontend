import * as express from 'express'
import { GuardFactory } from 'features/response/guards/guardFactory'
import { NotFoundError } from 'errors'
import { FeatureToggles } from 'utils/featureToggles'

export class OptInFeatureToggleGuard {
  /**
   * Throws NotFound error when feature is not opted of
   *
   * @param {string} feature feature name
   * @returns {express.RequestHandler} - request handler middleware
   */
  static featureEnabledGuard (feature: string): express.RequestHandler {
    return GuardFactory.create(
      (res: express.Response) => FeatureToggles.hasAnyAuthorisedFeature(res.locals.claim.features, feature),
      (req: express.Request, res: express.Response): void => {
        throw new NotFoundError(req.path)
      })
  }
}
