import * as express from 'express'
import * as path from 'path'

import { Paths } from 'eligibility/paths'

import { AuthTokenExtractor } from 'idam/authTokenExtractor'
import { IdamClient } from 'idam/idamClient'
import { hasTokenExpired } from 'idam/authorizationMiddleware'

import { ClaimType } from 'eligibility/model/claimType'
import { ClaimValue } from 'eligibility/model/claimValue'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

import { RouterFinder } from 'shared/router/routerFinder'

async function authorizationRequestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = AuthTokenExtractor.extract(req)
  if (token) {
    try {
      await IdamClient.retrieveUserFor(token)
      res.locals.isLoggedIn = true
    } catch (err) {
      if (!hasTokenExpired(err)) {
        next(err)
        return
      }
    }
  }
  next()
}

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.EligibilityPaths = Paths
      app.settings.nunjucksEnv.globals.ClaimType = ClaimType
      app.settings.nunjucksEnv.globals.ClaimValue = ClaimValue
      app.settings.nunjucksEnv.globals.DefendantAgeOption = DefendantAgeOption
    }

    app.use('/eligibility*', authorizationRequestHandler)
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
