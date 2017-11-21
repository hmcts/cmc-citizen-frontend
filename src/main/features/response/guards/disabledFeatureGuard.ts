import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { GuardFactory } from 'response/guards/guardFactory'
import { NotFoundError } from '../../../errors'
import { FeatureToggles } from 'utils/featureToggles'

export class DisabledFeatureGuard {

  /**
   * Throws NotFound error when feature is toggled off
   *
   * @param {string} feature
   * @returns {express.RequestHandler} - request handler middleware
   */
  static createHandlerThrowingNotFoundError (feature: string): express.RequestHandler {
    return GuardFactory.create(() => toBoolean(config.get<boolean>(feature)), (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }

  static anyFeatureEnabledGuard (...features: string[]): express.RequestHandler {
    return GuardFactory.create(() => FeatureToggles.isAnyEnabled(...features), (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }
}
