import * as express from 'express'

import { GuardFactory } from 'response/guards/guardFactory'
import { Logger } from '@hmcts/nodejs-logging'

import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { NotFoundError } from 'errors'

const logger = Logger.getLogger('response/guards/fullRejectionGuard')

export class FullRejectionGuard {

  static requestHandler (): express.RequestHandler {

    function isRequestAllowed (res: express.Response): boolean {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      return draft.document.isResponseRejected()
    }

    function accessDeniedCallback (req: express.Request, res: express.Response): void {
      logger.warn('Full Rejection Guard: user tried to access page for full rejection flow')
      throw new NotFoundError(req.path)
    }

    return GuardFactory.create(isRequestAllowed, accessDeniedCallback)
  }
}
