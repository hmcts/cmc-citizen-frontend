import * as express from 'express'

/* tslint:disable:no-default-export */
export default express.Router()
  .get('/not-implemented-yet', (req: express.Request, res: express.Response) => {
    res.render('not-implemented-yet')
  })
