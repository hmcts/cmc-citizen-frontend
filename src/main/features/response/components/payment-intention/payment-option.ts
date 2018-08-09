import * as express from 'express'

import { Paths } from 'response/paths'
import { Paths as PaymentIntentionPaths } from 'response/components/payment-intention/paths'

import { ErrorHandling } from 'main/common/errorHandling'
import { DefendantPaymentOption, DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { User } from 'main/app/idam/user'
import { DraftService } from 'services/draftService'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'main/app/claims/models/claim'
import { RoutablePath } from 'shared/router/routablePath'
import { FeatureToggles } from 'utils/featureToggles'

export class PaymentOptionPage {
  constructor (private admissionType: string) {}

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft

          this.renderView(new Form(draft.document[this.admissionType].paymentOption), res)
        }))
      .post(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<DefendantPaymentOption> = req.body

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {
              const draft: Draft<ResponseDraft> = res.locals.responseDraft
              const user: User = res.locals.user

              draft.document[this.admissionType].paymentOption = form.model

              const option: DefendantPaymentType = form.model.option

              if (option === DefendantPaymentType.IMMEDIATELY) {
                draft.document.statementOfMeans = undefined
              }

              if (option !== DefendantPaymentType.BY_SET_DATE) {
                draft.document[this.admissionType].paymentDate = undefined
              }

              if (option !== DefendantPaymentType.INSTALMENTS) {
                draft.document[this.admissionType].paymentPlan = undefined
              }

              await new DraftService().save(draft, user.bearerToken)

              const { externalId } = req.params
              switch (option) {
                case DefendantPaymentType.IMMEDIATELY:
                  return res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
                case DefendantPaymentType.BY_SET_DATE:
                  return res.redirect(new RoutablePath(path + PaymentIntentionPaths.paymentDatePage.uri).evaluateUri({ externalId: externalId }))
                case DefendantPaymentType.INSTALMENTS:
                  return res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
              }
            }
          }))
  }

  private renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
    function isApplicableFor (draft: ResponseDraft): boolean {
      if (!FeatureToggles.hasAnyAuthorisedFeature(res.locals.claim.features, 'admissions')) {
        return false
      }
      return draft.isResponseFullyAdmitted()
        && !draft.defendantDetails.partyDetails.isBusiness()
    }

    const draft: Draft<ResponseDraft> = res.locals.responseDraft
    const claim: Claim = res.locals.claim
    res.render('response/components/payment-intention/payment-option', {
      form: form,
      claim: claim,
      draft: draft.document,
      statementOfMeansIsApplicable: isApplicableFor(draft.document)
    })
  }
}
