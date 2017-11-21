import * as express from 'express'

import { Paths, PayBySetDatePaths } from 'response/paths'

import { ErrorHandling } from 'common/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'

function isAmountTooHighPartialResponse (responseDraft: ResponseDraft): boolean {
  return responseDraft.response.type.value === ResponseType.OWE_SOME_PAID_NONE.value
    && responseDraft.rejectPartOfClaim.option === RejectPartOfClaimOption.AMOUNT_TOO_HIGH
}

function formLabelFor (responseDraft: ResponseDraft): string {
  if (isAmountTooHighPartialResponse(responseDraft)) {
    return 'When will you pay the amount you admit you owe?'
  } else {
    return 'When will you pay?'
  }
}

function renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
  const user: User = res.locals.user
  res.render(Paths.defencePaymentOptionsPage.associatedView, {
    form: form,
    claim: user.claim,
    responseType: user.responseDraft.document.response.type,
    formLabel: formLabelFor(user.responseDraft.document)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentOptionsPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const user: User = res.locals.user

      renderView(new Form(user.responseDraft.document.defendantPaymentOption), res)
    }))
  .post(Paths.defencePaymentOptionsPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response): Promise<void> => {
        const form: Form<DefendantPaymentOption> = req.body
        const user: User = res.locals.user

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          user.responseDraft.document.defendantPaymentOption = form.model
          await new DraftService().save(user.responseDraft, user.bearerToken)

          const { externalId } = req.params
          switch (form.model.option) {
            case DefendantPaymentType.BY_SET_DATE:
              res.redirect(PayBySetDatePaths.paymentDatePage.evaluateUri({ externalId: externalId }))
              break
            case DefendantPaymentType.INSTALMENTS:
              res.redirect(Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
