import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'

function prepareUrls (externalId: string): object {
  return {
    addressUrl: Paths.theirDetailsPage.evaluateUri({ externalId: externalId }),
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function renderView (form: Form<Declaration>, req: express.Request, res: express.Response): void {
  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    details: res.locals.user.ccjDraft,
    ...prepareUrls(req.params.externalId)
  })
}

export default express.Router()
  .get(Paths.checkAndSendPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(Form.empty<Declaration>(), req, res)
  })
  .post(
    Paths.checkAndSendPage.uri,
    FormValidator.requestHandler(Declaration, Declaration.fromObject),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration> = req.body

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        res.redirect(Paths.ccjRequestedConfirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    })
