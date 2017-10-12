import * as express from 'express'

import { Paths } from 'first-contact/paths'
import { Paths as AppPaths } from 'app/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { ClaimReference } from 'app/forms/models/claimReference'

import ClaimStoreClient from 'claims/claimStoreClient'
import { ErrorHandling } from 'common/errorHandling'
import { RedirectHelper } from 'utils/redirectHelper'

function renderView (form: Form<ClaimReference>, res: express.Response): void {
  res.render(Paths.claimReferencePage.associatedView, { form: form })
}

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
        const linked: boolean = await ClaimStoreClient.isClaimLinked(form.model.reference)

        if (linked) {
          return res.redirect(AppPaths.homePage.uri)
        }
        res.redirect(RedirectHelper.getRedirectUriForPin(req, res, form.model.reference))
      }
    }))
