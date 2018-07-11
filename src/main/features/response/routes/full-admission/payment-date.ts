import * as express from 'express'
import { FullAdmissionPaths, Paths } from 'response/paths'
import { Form } from 'forms/form'
import { User } from 'idam/user'
import { FormValidator } from 'forms/validation/formValidator'
import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { PayBySetDate as PaymentDate } from 'forms/models/payBySetDate'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { Claim } from 'claims/models/claim'
import { Draft } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'
import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'

const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  return draft.document.fullAdmission
    && draft.document.fullAdmission.paymentOption
    && draft.document.fullAdmission.paymentOption.isOfType(DefendantPaymentType.BY_SET_DATE)
}, (req: express.Request, res: express.Response): void => {
  const claim: Claim = res.locals.claim

  res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
})

function renderView (form: Form<PaymentDate>, res: express.Response) {
  const futureDate: Moment = MomentFactory.currentDate().add(10, 'days')

  res.render(FullAdmissionPaths.paymentDatePage.associatedView, {
    form: form,
    futureDate: futureDate
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    FullAdmissionPaths.paymentDatePage.uri,
    FeatureToggleGuard.featureEnabledGuard('fullAdmission'),
    stateGuardRequestHandler,
    (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.fullAdmission.paymentDate), res)
    })
  .post(
    FullAdmissionPaths.paymentDatePage.uri,
    FeatureToggleGuard.featureEnabledGuard('fullAdmission'),
    stateGuardRequestHandler,
    FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const form: Form<PaymentDate> = req.body
      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<ResponseDraft> = res.locals.responseDraft
        const user: User = res.locals.user

        draft.document.fullAdmission.paymentDate = form.model
        await new DraftService().save(draft, user.bearerToken)

        res.redirect(Paths.taskListPage.evaluateUri({ externalId: req.params.externalId }))
      }
    }))
