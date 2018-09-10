import * as express from 'express'
import { Paths } from 'testing-support/paths'
import { ErrorHandling } from 'shared/errorHandling'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.indexPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      res.render(Paths.indexPage.associatedView, { paths: Paths })
    })
  )
