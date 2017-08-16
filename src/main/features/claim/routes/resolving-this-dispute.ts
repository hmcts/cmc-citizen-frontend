import * as express from 'express'

import { Paths } from 'claim/paths'

import { ClaimDraftMiddleware } from 'claim/draft/claimDraftMiddleware'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(Paths.resolvingThisDisputerPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.resolvingThisDisputerPage.associatedView)
  })
  .post(
    Paths.resolvingThisDisputerPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      res.locals.user.claimDraft.readResolveDispute = true
      await ClaimDraftMiddleware.save(res, next)
      res.redirect(Paths.taskListPage.uri)
    }))
