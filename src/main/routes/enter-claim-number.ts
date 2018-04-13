import * as express from 'express'
import * as config from 'config'

import { ErrorHandling } from 'common/errorHandling'
import { Paths } from 'app/paths'
import { FormValidator } from 'forms/validation/formValidator'
import { ClaimReference } from 'forms/models/claimReference'
import { isCMCReference } from 'common/utils/isCMCReference'
import { isCCBCCaseReference } from 'common/utils/isCCBCCaseReference'
import { Form, FormValidationError } from 'forms/form'
import { ValidationError } from 'class-validator'

function renderView (form: Form<ClaimReference>, res: express.Response): void {
  res.render(Paths.enterClaimNumberPage.associatedView, { form: form })
}

const mcolUrl = config.get<string>('mcol.url')
const ERROR_MESSAGE: string = "Reference number is invalid. Please click on 'don't have claim reference number'"

let addErrorMessage = function (form: Form<ClaimReference>) {
  const validationError = new ValidationError()
  validationError.property = 'reference'
  validationError.target = { 'reference': form.model.reference }
  validationError.value = form.model.reference
  validationError.constraints = { ['isInvalidReference']: ERROR_MESSAGE }
  form.errors.push(new FormValidationError(validationError, ''))
}

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
        } else if (isCCBCCaseReference(form.model.reference)) {
          return res.redirect(mcolUrl)
        } else {
          addErrorMessage(form)
          renderView(form, res)
        }
      }
    })
  )
