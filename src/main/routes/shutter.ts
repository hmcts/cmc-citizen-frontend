import * as express from 'express'
import { Paths as AppPaths } from 'paths'
import { FeatureTogglesService } from 'shared/clients/featureTogglesService'
import { User } from 'idam/user'
import * as cache from 'memory-cache'

function featureToggleCache (duration) {
  const key = 'cmc_citizen_frontend_maintenance_unplanned'
  let cachedValue = cache.get(key)
  if (cachedValue) {
    // tslint:disable-next-line
    console.log('cached value ' + JSON.stringify(cachedValue))
    return cachedValue
  } else {
    let featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
    const user: User = new User('', '', '', '', [], '', '')

    cachedValue = featureTogglesService.isToggleFeatureEnabled(user, [], key)
    cache.put(key, cachedValue, duration * 1000)
    // tslint:disable-next-line
    console.log('put cached value ' + JSON.stringify(cachedValue))
    return cachedValue
  }
}

export class Shutter {
  enableFor (app: express.Express) {
    app.all(/^((?!shutter).)*$/, (req, res, next) => {
      featureToggleCache(30).then(
        isFeatureToggleEnabled => {
          if (isFeatureToggleEnabled) {
            // tslint:disable-next-line
            console.log('isFeatureToggleEnabled ' + JSON.stringify(isFeatureToggleEnabled))
            return res.render(AppPaths.unplannedShutterPage.associatedView)
          }
          return next()
        }
      )
    })
  }
}
