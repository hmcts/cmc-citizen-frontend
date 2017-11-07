import * as express from 'express'

import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'common/errorHandling'

import { DraftService } from 'services/draftService'

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
      const userAuthToken: string = res.locals.user.bearerToken

      const drafts = await draftService.find(getDraftType(req), '100', userAuthToken, (value) => value)

      drafts.forEach(async draft => {
        await new DraftService().delete(draft.id, userAuthToken)
      })

      res.redirect(Paths.indexPage.uri)
    })
  )
