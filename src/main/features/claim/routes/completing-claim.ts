import * as express from 'express'

import { Paths } from 'claim/paths'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(Paths.completingClaimPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.completingClaimPage.associatedView)
  })
  .post(
    Paths.completingClaimPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.user.claimDraft.document.readCompletingClaim = true
      await ClaimDraftMiddleware.save(res, next)
      res.redirect(Paths.taskListPage.uri)
    }))
