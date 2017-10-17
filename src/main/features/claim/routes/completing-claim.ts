import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/DraftService'


export default express.Router()
  .get(Paths.completingClaimPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.completingClaimPage.associatedView)
  })
  .post(
    Paths.completingClaimPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.locals.user.claimDraft.document.readCompletingClaim = true

      await new DraftService()['save'](res.locals.user.claimDraft, res.locals.user.bearerToken)

      res.redirect(Paths.taskListPage.uri)
    }))
