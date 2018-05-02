import * as express from 'express'

import { Paths } from 'claim/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.resolvingThisDisputerPage.uri, (req: express.Request, res: express.Response) => {
    res.render(Paths.resolvingThisDisputerPage.associatedView)
  })
  .post(
    Paths.resolvingThisDisputerPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const draft: Draft<DraftClaim> = res.locals.claimDraft
      const user: User = res.locals.user

      draft.document.readResolveDispute = true
      await new DraftService().save(draft, user.bearerToken)

      res.redirect(Paths.taskListPage.uri)
    }))
