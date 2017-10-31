import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'common/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import User from 'idam/user'
import { DraftService } from 'services/draftService'

export default express.Router()
  .get(Paths.defenceFullPartialPaymentOptionsPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const defendantPaymentOption: DefendantPaymentOption = res.locals.user.responseDraft.document.defendantPaymentOption

      res.render(Paths.defenceFullPartialPaymentOptionsPage.associatedView, { form: new Form(defendantPaymentOption) })
    }))
  .post(Paths.defenceFullPartialPaymentOptionsPage.uri,
    FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<DefendantPaymentOption> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          res.render(Paths.defenceFullPartialPaymentOptionsPage.associatedView, { form: form })
        } else {
          user.responseDraft.document.defendantPaymentOption = form.model
          await new DraftService().save(user.responseDraft, user.bearerToken)

          const { externalId } = req.params

          switch (form.model.option) {
            case DefendantPaymentType.FULL_BY_SPECIFIED_DATE:
              res.redirect(Paths.defenceFullPartialPaymentOptionsPage.evaluateUri({ externalId: externalId }))
              break
            case DefendantPaymentType.INSTALMENTS:
              res.redirect(Paths.defenceFullPartialPaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
