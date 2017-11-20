import * as express from 'express'

import { Paths } from 'response/paths'

import { ErrorHandling } from 'common/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { DisabledFeatureGuard } from 'response/guards/disabledFeatureGuard'

function renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
  const user: User = res.locals.user
  res.render(Paths.defencePaymentOptionsPage.associatedView, {
    form: form,
    claim: user.claim
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentOptionsPage.uri,
    DisabledFeatureGuard.createHandlerThrowingNotFoundError('featureToggles.fullAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      renderView(new Form(user.responseDraft.document.defendantPaymentOption), res)
    }))
  .post(Paths.defencePaymentOptionsPage.uri,
    DisabledFeatureGuard.createHandlerThrowingNotFoundError('featureToggles.fullAdmission'),
    FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        const form: Form<DefendantPaymentOption> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          user.responseDraft.document.defendantPaymentOption = form.model
          await new DraftService().save(user.responseDraft, user.bearerToken)

          switch (form.model.option) {
            case DefendantPaymentType.FULL_BY_SPECIFIED_DATE:
              res.redirect('/not-implemented-yet')
              break
            case DefendantPaymentType.INSTALMENTS:
              const { externalId } = req.params
              res.redirect(Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
