import * as express from 'express'

import { Paths } from 'response/paths'

import { User } from 'app/idam/user'

async function renderView (res: express.Response, next: express.NextFunction) {
  try {
    const user: User = res.locals.user
    res.render(Paths.partialAdmissionPage.associatedView, {
      claim: user.claim,
      response: user.responseDraft.document
    })
  } catch (err) {
    next(err)
  }
}

export default express.Router()
  .get(Paths.partialAdmissionPage.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await renderView(res, next)
  })
