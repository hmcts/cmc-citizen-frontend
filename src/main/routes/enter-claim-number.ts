import * as express from 'express'
import * as config from 'config'

import { ErrorHandling } from 'common/errorHandling'
import { Paths } from 'app/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimReference } from 'forms/models/claimReference'
import { isCCBCCaseReference } from 'common/utils/isCCBCCaseReference'
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
        if (isCCBCCaseReference(form.model.reference)) {
          return res.redirect(mcolUrl)
        }

        renderView(form, res)
      } else {
        res.redirect(Paths.homePage.uri)
      }
    })
  )
