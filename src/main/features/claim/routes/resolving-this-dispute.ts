import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'common/errorHandling'
import { DraftService } from 'services/draftService'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.resolvingThisDisputerPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.resolvingThisDisputerPage.associatedView)
  })
  .post(
    Paths.resolvingThisDisputerPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      res.locals.user.claimDraft.document.readResolveDispute = true

      await new DraftService().save(res.locals.user.claimDraft, res.locals.user.bearerToken)

      res.redirect(Paths.taskListPage.uri)
    }))
