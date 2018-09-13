import * as express from 'express'
import { Paths as AppPaths } from 'paths'
import { FeatureTogglesService } from 'shared/clients/featureTogglesService'
import { User } from 'idam/user'

export class Shutter {
  enableFor (app: express.Express) {

    const featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
    const user: User = new User('','', '', '',[], '', '')

    app.all(/^((?!shutter).)*$/, (req, res, next) => {
      featureTogglesService.isToggleFeatureEnabled(user, [], 'cmc_citizen_frontend_maintenance_unplanned').then(isFeatureToggleEnabled => {
        if (isFeatureToggleEnabled) {
          return res.render(AppPaths.unplannedShutterPage.associatedView)
        } else {
          return next()
        }

      })
    })
  }
}
