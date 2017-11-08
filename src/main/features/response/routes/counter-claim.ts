import * as express from 'express'

import { Paths } from 'response/paths'

import { User } from 'app/idam/user'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user

    res.render(Paths.counterClaimPage.associatedView, {
      claim: user.claim,
      response: user.responseDraft.document
    })
  } catch (err) {
    next(err)
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.counterClaimPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
