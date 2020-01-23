import * as express from 'express'
import { Paths as ClaimPaths } from 'claim/paths'
import { Form } from 'forms/form'
import { FeatureConsentResponse } from 'forms/models/featureConsentResponse'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { YesNoOption } from 'models/yesNoOption'
import { User } from 'idam/user'
import { GuardFactory } from 'response/guards/guardFactory'
import { trackCustomEvent } from 'logging/customEventTracker'

const claimStoreClient = new ClaimStoreClient()

function renderView (form: Form<FeatureConsentResponse>, res: express.Response) {
  res.render(ClaimPaths.newFeaturesConsentPage.associatedView, { form: form })
}

function checkConsentedAlready (): express.RequestHandler {
  return GuardFactory.createAsync(async (req: express.Request, res: express.Response) => {
    const user: User = res.locals.user
    const roles = await claimStoreClient.retrieveUserRoles(user)

    return roles && !roles.some(role => role.includes('cmc-new-features-consent'))
  }, (req: express.Request, res: express.Response): void => {
    res.redirect(ClaimPaths.taskListPage.uri)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(ClaimPaths.newFeaturesConsentPage.uri,
    checkConsentedAlready(), (req: express.Request, res: express.Response) => {
      renderView(Form.empty<FeatureConsentResponse>(), res)
    })
  .post(ClaimPaths.newFeaturesConsentPage.uri,
    checkConsentedAlready(),
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
        trackCustomEvent('New features consent - ' + roleName, {})
        res.redirect(ClaimPaths.taskListPage.uri)
      }
    }))
