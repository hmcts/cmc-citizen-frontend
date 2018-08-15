import * as express from 'express'
import { Paths } from 'response/paths'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    Paths.youHavePaidLess.uri,
    function (req, res) {
      res.render(Paths.youHavePaidLess.associatedView)
    })
  .post(
    Paths.youHavePaidLess.uri,
    function (req, res) {
      res.redirect(Paths.taskListPage.evaluateUri({ externalId: res.locals.claim.externalId }))
    })
