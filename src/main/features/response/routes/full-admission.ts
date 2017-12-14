import * as express from 'express'

import { Paths } from 'response/paths'

import { User } from 'app/idam/user'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    const user: User = res.locals.user

    res.render(Paths.fullAdmissionPage.associatedView, {
      claim: user.claim,
      response: draft.document
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.fullAdmissionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
