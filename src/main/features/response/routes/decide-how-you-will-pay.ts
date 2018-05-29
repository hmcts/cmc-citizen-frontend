import * as express from 'express'

import { Paths, PayBySetDatePaths } from 'response/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

function renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const claim: Claim = res.locals.claim
  res.render(Paths.defencePaymentOptionsPage.associatedView, {
    form: form,
    claim: claim,
    draft: draft.document,
    statementOfMeansIsApplicable: StatementOfMeans.isApplicableFor(draft.document)
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentOptionsPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      renderView(new Form(draft.document.fullAdmission.paymentOption), res)
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

          draft.document.fullAdmission.paymentOption = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          switch (form.model.option) {
            case DefendantPaymentType.IMMEDIATELY:
              return res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
            case DefendantPaymentType.BY_SET_DATE:
              return res.redirect(PayBySetDatePaths.paymentDatePage.evaluateUri({ externalId: externalId }))
            case DefendantPaymentType.INSTALMENTS:
              return res.redirect(Paths.defencePaymentPlanPage.evaluateUri({ externalId: externalId }))
          }
        }
      }))
