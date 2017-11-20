import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { GuardFactory } from 'response/guards/guardFactory'
import { NotFoundError } from '../../../errors'

export class DisabledFeatureGuard {

  /**
   * Throws NotFound error when feature is toggled off
   *
   * @param {string} feature
   * @returns {e.RequestHandler} - request handler middleware
   */
  static createHandlerThrowingNotFoundError (feature: string): express.RequestHandler {
    return GuardFactory.create(() => toBoolean(config.get<boolean>(feature)), (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })
  }
}
