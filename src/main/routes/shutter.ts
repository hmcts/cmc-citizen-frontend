import * as express from 'express'
import * as path from 'path'
import { Paths as AppPaths } from 'paths'
import { RouterFinder } from 'shared/router/routerFinder'
import { FeatureTogglesService } from 'shared/clients/featureTogglesService'
import { User } from 'idam/user'

/* tslint:disable:no-default-export */
/*export default express.Router()
  .all(/^((?!shutter-unplanned).)*$/,
    (req: express.Request, res: express.Response) => {
      const featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
      // tslint:disable-next-line:no-console
      console.log('I am in shutter-unplanned')
      // test credentials for localhost:8580
      const user: User = new User('27','tharacka@kainos.com', 'tharack', 'ahmed',[], '', '')
      const roles: string[] = ['cmc-new-features-consent-given']
      featureTogglesService.isToggleFeatureEnabled(user, roles, 'cmc_shutter_page').then(isFeatureToggleEnabled => {
        if (isFeatureToggleEnabled) {
          res.render(AppPaths.unplannedShutterPage.associatedView)
          // tslint:disable-next-line:no-console
          console.log('I am in shutter-unplanned 2')
        }
      })
    })

function requestHandler (): express.RequestHandler {

  const featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
  const user: User = new User('27','tharacka@kainos.com', 'tharack', 'ahmed',[], '', '')
  const roles: string[] = ['cmc-new-features-consent-given']

  function shutterIsEnabledCallback (req: express.Request, res: express.Response): void {
    featureTogglesService.isToggleFeatureEnabled(user, roles, 'cmc_shutter_page').then(isFeatureToggleEnabled => {
      if (isFeatureToggleEnabled) {
        res.render(AppPaths.unplannedShutterPage.associatedView)
        // tslint:disable-next-line:no-console
        console.log('I am in shutter-unplanned 2')
      }
    })
  }

  return shutterIsEnabledCallback

}
*/

export class Shutter {
  enableFor (app: express.Express) {

    // tslint:disable-next-line:no-console
    console.log('I am in shutter-unplanned')
    const allRoutesExceptShutterPage = /^((?!shutter).)*$/
    const featureTogglesService: FeatureTogglesService = new FeatureTogglesService()
    const user: User = new User('27','tharacka@kainos.com', 'tharack', 'ahmed',[], '', '')
    const roles: string[] = ['cmc-new-features-consent-given']

    app.all(allRoutesExceptShutterPage, (req, res) => {
      featureTogglesService.isToggleFeatureEnabled(user, roles, 'cmc_shutter_page').then(isFeatureToggleEnabled => {
        if (isFeatureToggleEnabled) {
          res.render(AppPaths.unplannedShutterPage.associatedView)
          // tslint:disable-next-line:no-console
          console.log('I am in shutter-unplanned 2')
        } else {
          app.use('/', RouterFinder.findAll(path.join(__dirname, 'routes')))
        }
      })
    })
  }
}
