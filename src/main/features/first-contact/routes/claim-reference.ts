import * as express from 'express'
import * as config from 'config'

import { Paths } from 'first-contact/paths'
import { Paths as AppPaths } from 'paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { ClaimReference } from 'forms/models/claimReference'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { ErrorHandling } from 'shared/errorHandling'
import { OAuthHelper } from 'idam/oAuthHelper'
import { isCCBCCaseReference } from 'shared/utils/isCCBCCaseReference'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

function renderView (form: Form<ClaimReference>, res: express.Response): void {
  res.render(Paths.claimReferencePage.associatedView, { form: form })
}

const mcolUrl = config.get<string>('mcol.url')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimReferencePage.uri, (req: express.Request, res: express.Response) => {
    renderView(Form.empty<ClaimReference>(), res)
  })
  .post(Paths.claimReferencePage.uri, FormValidator.requestHandler(ClaimReference),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<ClaimReference> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (isCCBCCaseReference(form.model.reference)) {
          return res.redirect(mcolUrl)
        }

        const linked: boolean = await claimStoreClient.isClaimLinked(form.model.reference)

        if (linked) {
          return res.redirect(AppPaths.homePage.uri)
        }
        res.redirect(OAuthHelper.forPin(req, res, form.model.reference.toUpperCase()))
      }
    }))
