import * as express from 'express'

import { Paths } from 'response/paths'

import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    res.render(Paths.fullAdmissionPage.associatedView, {
      claim: claim,
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
