import * as express from 'express'
import { Paths } from 'response/paths'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

export class MoreTimeAlreadyRequestedGuard {

  static requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user
    if (draft.document.isMoreTimeRequested()) {
      res.redirect(Paths.moreTimeConfirmationPage.evaluateUri({ externalId: user.claim.externalId }))
    } else {
      next()
    }
  }
}
