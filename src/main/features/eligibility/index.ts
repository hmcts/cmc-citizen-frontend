import * as express from 'express'
import * as path from 'path'

import { Paths } from 'eligibility/paths'

import { ClaimType } from 'eligibility/model/claimType'
import { ClaimValue } from 'eligibility/model/claimValue'
import { DefendantAgeOption } from 'eligibility/model/defendantAgeOption'

import { RouterFinder } from 'common/router/routerFinder'

export class Feature {
  enableFor (app: express.Express) {
    if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
      app.settings.nunjucksEnv.globals.EligibilityPaths = Paths
      app.settings.nunjucksEnv.globals.ClaimType = ClaimType
      app.settings.nunjucksEnv.globals.ClaimValue = ClaimValue
      app.settings.nunjucksEnv.globals.DefendantAgeOption = DefendantAgeOption
    }
    app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
  }
}
