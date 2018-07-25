import * as express from 'express'

import { Paths } from 'response/paths'
import { Paths as PaymentIntentionPaths } from 'response/components/payment-intention/paths'

import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { Form } from 'forms/form'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { FormValidator } from 'forms/validation/formValidator'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { User } from 'idam/user'
import { Moment } from 'moment'

import { ResponseDraft } from 'response/draft/responseDraft'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'

export class PaymentDatePage {

  constructor (private admissionType: string) {}

  buildRouter (path: string = ''): express.Router {
    const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      return draft.document[this.admissionType]
        && draft.document[this.admissionType].paymentOption
        && draft.document[this.admissionType].paymentOption.isOfType(DefendantPaymentType.BY_SET_DATE)
    }, (req: express.Request, res: express.Response): void => {
      const claim: Claim = res.locals.claim

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })

    return express.Router()
      .get(
        path + PaymentIntentionPaths.paymentDatePage.uri,
        FeatureToggleGuard.featureEnabledGuard('admissions'),
        stateGuardRequestHandler,
        (req: express.Request, res: express.Response) => {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          this.renderView(new Form(draft.document[this.admissionType].paymentDate), res)
        })
      .post(
        path + PaymentIntentionPaths.paymentDatePage.uri,
        FeatureToggleGuard.featureEnabledGuard('admissions'),
        stateGuardRequestHandler,
        FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const form: Form<PaymentDate> = req.body
          if (form.hasErrors()) {
            this.renderView(form, res)
          } else {
            const draft: Draft<ResponseDraft> = res.locals.responseDraft
            const user: User = res.locals.user

            draft.document[this.admissionType].paymentDate = form.model
            await new DraftService().save(draft, user.bearerToken)

            res.redirect(Paths.taskListPage.evaluateUri({ externalId: req.params.externalId }))
          }
        }))
  }

  private renderView (form: Form<PaymentDate>, res: express.Response) {
    const futureDate: Moment = MomentFactory.currentDate().add(1, 'month')

    res.render('response/components/payment-intention/payment-date', {
      form: form,
      futureDate: futureDate
    })
  }
}
