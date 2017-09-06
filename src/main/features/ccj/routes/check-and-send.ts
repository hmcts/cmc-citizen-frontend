import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import StatementOfTruth from 'forms/models/statementOfTruth'
import { FormValidator } from 'forms/validation/formValidator'

function prepareUrls (externalId: string): object {
  return {
    addressUrl: Paths.theirDetailsPage.evaluateUri({ externalId: externalId }),
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function renderView (form: Form<StatementOfTruth>, req: express.Request, res: express.Response): void {

  console.log(res.locals.user.ccjDraft)

  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    details: res.locals.user.ccjDraft,
    ...prepareUrls(req.params.externalId)
  })
}

export default express.Router()
  .get(Paths.checkAndSendPage.uri, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    renderView(Form.empty<StatementOfTruth>(), req, res)
  })
  .post(
    Paths.checkAndSendPage.uri,
    FormValidator.requestHandler(StatementOfTruth, StatementOfTruth.fromObject),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        res.redirect(Paths.ccjRequestedConfirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    })
