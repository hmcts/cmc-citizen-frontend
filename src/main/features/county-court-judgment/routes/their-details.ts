import * as express from 'express'

import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(Paths.theirDetailsPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {

    res.render(Paths.theirDetailsPage.associatedView, {
      claim: res.locals.user.claim
    })
  }))
