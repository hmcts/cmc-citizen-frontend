import * as express from 'express'
import { Paths } from 'ccj/paths'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { Declaration } from 'ccj/form/models/declaration'
import { CCJClient } from 'claims/ccjClient'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { DraftCCJService } from 'ccj/draft/draftCCJService'

function prepareUrls (externalId: string): object {
  return {
    addressUrl: Paths.theirDetailsPage.evaluateUri({ externalId: externalId }),
    dateOfBirthUrl: Paths.dateOfBirthPage.evaluateUri({ externalId: externalId }),
    paidAmountUrl: Paths.paidAmountPage.evaluateUri({ externalId: externalId }),
    paymentOptionUrl: Paths.paymentOptionsPage.evaluateUri({ externalId: externalId })
  }
}

function renderView (form: Form<Declaration>, req: express.Request, res: express.Response): void {
  res.render(Paths.checkAndSendPage.associatedView, {
    form: form,
    details: res.locals.user.ccjDraft,
    amountToBePaid: res.locals.user.claim.totalAmount - (res.locals.user.ccjDraft.paidAmount.amount || 0),
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
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<Declaration> = req.body
      const user: User = res.locals.user

      if (form.hasErrors()) {
        renderView(form, req, res)
      } else {
        await CCJClient.save(user)
        await DraftCCJService.delete(res, next)
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
