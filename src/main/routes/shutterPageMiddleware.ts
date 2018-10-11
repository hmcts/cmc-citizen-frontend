import * as express from 'express'
import { Paths as AppPaths } from 'paths'
import { FeatureTogglesService } from 'shared/clients/featureTogglesService'
import { User } from 'idam/user'
import * as cache from 'memory-cache'

const shutterDurationSeconds: number = 180

export class ShutterPageMiddleware {
  enableFor (app: express.Express) {
    app.all(/^((?!shutter).)*$/, (req, res, next) => {
      this.featureToggleCache('cmc_citizen_frontend_maintenance_unplanned', shutterDurationSeconds).then(
        isFeatureToggleEnabled => {
          if (isFeatureToggleEnabled) {
            return res.render(AppPaths.unplannedShutterPage.associatedView)
          }
          return next()
        }
      )
    })
  }

  featureToggleCache (key: string, duration: number) {

    let cachedValue = cache.get(key)
    if (cachedValue) {
      return cachedValue
    } else {
      let featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
      const user: User = new User('', '', '', '', [], '', '')

      cachedValue = featureTogglesService.isToggleFeatureEnabled(user, [], key)
      cache.put(key, cachedValue, duration * 1000)
      return cachedValue
    }
  }
}
