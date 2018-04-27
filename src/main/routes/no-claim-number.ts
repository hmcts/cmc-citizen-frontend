import * as express from 'express'
import * as config from 'config'

import { ErrorHandling } from 'shared/errorHandling'
import { Paths } from 'paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { NoClaimNumber } from 'forms/models/noClaimNumber'
import { Service } from 'models/service'

function renderView (form: Form<NoClaimNumber>, res: express.Response): void {
  res.render(Paths.noClaimNumberPage.associatedView, { form: form })
}

const mcolUrl = config.get<string>('mcol.url')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.noClaimNumberPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      renderView(Form.empty<NoClaimNumber>(), res)
    })
  )
  .post(
    Paths.noClaimNumberPage.uri,
    FormValidator.requestHandler(undefined, NoClaimNumber.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const form: Form<NoClaimNumber> = req.body

      if (form.hasErrors()) {
        return renderView(form, res)
      }

      switch (form.model.service) {
        case Service.MONEYCLAIMS:
          res.redirect(Paths.homePage.uri)
          break
        case Service.MCOL:
          res.redirect(mcolUrl)
          break
        default:
          throw new Error(`Unexpected service: ${form.model.service}`)
      }
    })
  )
