import * as express from 'express'
import * as config from 'config'

import { Paths } from 'first-contact/paths'

import { FormValidator } from 'forms/validation/formValidator'
import { Form } from 'forms/form'
import { ClaimReference } from 'app/forms/models/claimReference'

import { buildURL } from 'app/utils/callbackBuilder'

function renderView (form: Form<ClaimReference>, res: express.Response): void {
  res.render(Paths.claimReferencePage.associatedView, { form: form })
}

function receiverPath (req: express.Request, reference: string): string {
  const callbackPath = `${Paths.claimSummaryPage.uri}?ref=${reference}`
  return `${config.get('idam.authentication-web.url')}/login/pin?continue-url=${buildURL(req, callbackPath)}`
}

export default express.Router()
  .get(Paths.claimReferencePage.uri, (req: express.Request, res: express.Response) => {
    renderView(Form.empty<ClaimReference>(), res)
  })
  .post(Paths.claimReferencePage.uri, FormValidator.requestHandler(ClaimReference), (req: express.Request, res: express.Response) => {
    const form: Form<ClaimReference> = req.body

    if (form.hasErrors()) {
      renderView(form, res)
    } else {
      res.redirect(receiverPath(req, form.model.reference))
    }
  })
