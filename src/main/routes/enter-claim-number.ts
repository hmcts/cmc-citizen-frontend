import * as express from 'express'
import * as config from 'config'

import { ErrorHandling } from 'shared/errorHandling'
import { Paths } from 'paths'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimReference } from 'forms/models/claimReference'
import { isCMCReference } from 'shared/utils/isCMCReference'
import { Form } from 'forms/form'

function renderView (form: Form<ClaimReference>, res: express.Response): void {
  res.render(Paths.enterClaimNumberPage.associatedView, { form: form })
}

const mcolUrl = config.get<string>('mcol.url')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.enterClaimNumberPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      renderView(Form.empty<ClaimReference>(), res)
    })
  )
  .post(
    Paths.enterClaimNumberPage.uri,
    FormValidator.requestHandler(ClaimReference),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<ClaimReference> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        if (isCMCReference(form.model.reference)) {
          res.redirect(Paths.homePage.uri)
        } else {
          res.redirect(mcolUrl)
        }
      }
    })
  )
