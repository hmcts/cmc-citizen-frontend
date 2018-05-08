import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { DraftService } from 'services/draftService'
import { User } from 'idam/user'

const draftService = new DraftService()

function getDraftType (req: express.Request): string {
  return Object.keys(req.body.action)[0]
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.deleteDraftsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.deleteDraftsPage.associatedView)
    })
  )
  .post(Paths.deleteDraftsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user
      const drafts = await draftService.find(getDraftType(req), '100', user.bearerToken, (value) => value)

      drafts.forEach(async draft => {
        await new DraftService().delete(draft.id, user.bearerToken)
      })

      res.redirect(Paths.indexPage.uri)
    })
  )
