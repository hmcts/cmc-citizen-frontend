import * as express from 'express'

import {Paths, PayBySetDatePaths } from 'response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { ResponseType } from 'response/form/models/responseType'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

function isAmountTooHighPartialResponse (responseDraft: ResponseDraft): boolean {
  return responseDraft.response.type.value === ResponseType.PART_ADMISSION.value
    && responseDraft.rejectPartOfClaim.option === RejectPartOfClaimOption.AMOUNT_TOO_HIGH
}

function formLabelFor (responseDraft: ResponseDraft): string {
  if (isAmountTooHighPartialResponse(responseDraft)) {
    return 'When will you pay the amount you admit you owe?'
  } else {
    return 'How do you want to pay?'
  }
}

function renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const claim: Claim = res.locals.claim
  res.render(Paths.defencePaymentOptionsPage.associatedView, {
    form: form,
    claim: claim,
    responseType: draft.document.response.type,
    formLabel: formLabelFor(draft.document),
    statementOfMeansIsApplicable: StatementOfMeans.isApplicableFor(draft.document)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentOptionsPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.defendantPaymentOption), res)
    }))
  .post(Paths.defencePaymentOptionsPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response): Promise<void> => {
        const form: Form<DefendantPaymentOption> = req.body

        if (form.hasErrors()) {
          renderView(form, res)
        } else {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          const user: User = res.locals.user

          draft.document.defendantPaymentOption = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          switch (form.model.option) {
            case DefendantPaymentType.BY_SET_DATE:
              res.redirect(PayBySetDatePaths.payByDatestatementPage.evaluateUri({ externalId: externalId }))
              break
            case DefendantPaymentType.INSTALMENTS:
              res.redirect(Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId }))
              break
          }
        }
      }))
