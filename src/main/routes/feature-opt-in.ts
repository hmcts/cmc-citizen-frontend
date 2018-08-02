import * as express from 'express'

import { Paths as AppPaths } from 'paths'
import { Paths as claimPaths } from 'claim/paths'
import { Form } from 'forms/form'
import { FeatureConsentResponse } from 'forms/models/featureConsentResponse'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { Logger } from '@hmcts/nodejs-logging'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { YesNoOption } from 'models/yesNoOption'
import { User } from 'idam/user'

const logger = Logger.getLogger('featureOptIn')
const claimStoreClient = new ClaimStoreClient()

function renderView (form: Form<FeatureConsentResponse>, res: express.Response) {

  res.render(AppPaths.featureOptInPage.associatedView, { form: form })

}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.featureOptInPage.uri,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {

      renderView(new Form(new FeatureConsentResponse()), res)

    })
  .post(AppPaths.featureOptInPage.uri,
    FormValidator.requestHandler(FeatureConsentResponse, FeatureConsentResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {

      const form: Form<FeatureConsentResponse> = req.body

      const user: User = res.locals.user
      console.log(user)
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        logger.debug('coming here')
        let roleName
        if (form.model.consentResponse.option === YesNoOption.YES.option) {
          roleName = 'cmc-new-features-consent-given'
        } else {
          roleName = 'cmc-new-features-consent-not-given'
        }
        await claimStoreClient.persistRoleName(user, roleName)
        res.redirect(claimPaths.taskListPage.uri)
      }

    }))


