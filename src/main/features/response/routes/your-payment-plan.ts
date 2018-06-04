import * as express from 'express'
import * as _ from 'lodash'
import { Paths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { createPaymentPlan } from 'common/paymentPlan'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'

function mapFrequencyInWeeks (frequency: PaymentSchedule): number {
  switch (frequency) {
    case PaymentSchedule.EACH_WEEK:
      return 1
    case PaymentSchedule.EVERY_TWO_WEEKS:
      return 2
    case PaymentSchedule.EVERY_MONTH:
      return 4
    default:
      return undefined
  }
}

function renderView (form: Form<DefendantPaymentPlan>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const draft: Draft<ResponseDraft> = res.locals.responseDraft
  const alreadyPaid: number = draft.document.paidAmount.amount || 0
  const { remainingAmount, instalmentAmount, paymentSchedule } = form.model

  let paymentLength
  if (remainingAmount && instalmentAmount && paymentSchedule) {
    paymentLength = createPaymentPlan(remainingAmount, instalmentAmount, mapFrequencyInWeeks(paymentSchedule)).getPaymentLength()
  }

  res.render(Paths.defencePaymentPlanPage.associatedView, {
    form: form,
    paymentLength,
    monthlyIncome: draft.document.statementOfMeans.monthlyIncome,
    monthlyExpenses: draft.document.statementOfMeans.monthlyExpenses,
    remainingAmount: claim.totalAmountTillToday - alreadyPaid
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.defencePaymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.defendantPaymentPlan), res)
    }))

  .post(Paths.defencePaymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission', 'partialAdmission'),
    FormValidator.requestHandler(DefendantPaymentPlan, DefendantPaymentPlan.fromObject, undefined, ['calculatePaymentPlan']),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response): Promise<void> => {
        const form: Form<DefendantPaymentPlan> = req.body
        if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
          renderView(form, res)
        } else {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          const user: User = res.locals.user

          draft.document.defendantPaymentPlan = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }))
