import * as express from 'express'
import { Paths as ClaimPaths } from 'claim/paths'
import { Form } from 'forms/form'
import { FeatureConsentResponse } from 'forms/models/featureConsentResponse'
import { NewFeaturesConsentGuard } from 'claim/guards/newFeaturesConsentGuard'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { YesNoOption } from 'models/yesNoOption'
import { User } from 'idam/user'

const claimStoreClient = new ClaimStoreClient()

function renderView (form: Form<FeatureConsentResponse>, res: express.Response) {
  res.render(ClaimPaths.newFeaturesConsent.associatedView, { form: form })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(ClaimPaths.newFeaturesConsent.uri,
    NewFeaturesConsentGuard.requestHandler, (req: express.Request, res: express.Response) => {
      renderView(Form.empty<FeatureConsentResponse>(), res)
    })
  .post(ClaimPaths.newFeaturesConsent.uri,
    FormValidator.requestHandler(FeatureConsentResponse, FeatureConsentResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<FeatureConsentResponse> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        let roleName
        if (form.model.consentResponse.option === YesNoOption.YES.option) {
          roleName = 'cmc-new-features-consent-given'
        } else {
          roleName = 'cmc-new-features-consent-not-given'
        }
        await claimStoreClient.addRoleToUser(user, roleName)
        res.redirect(ClaimPaths.taskListPage.uri)
      }
    }))
