import * as express from 'express'

export default express.Router()
  .get('/not-implemented-yet', (req: express.Request, res: express.Response) => {
    res.render('not-implemented-yet')
  })
