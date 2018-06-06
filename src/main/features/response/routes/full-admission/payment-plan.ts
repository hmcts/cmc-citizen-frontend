import * as express from 'express'

import * as _ from 'lodash'

import { Paths, FullAdmissionPaths } from 'response/paths'

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
      throw new Error('Unknown payment schedule')
  }
}

function renderView (form: Form<DefendantPaymentPlan>, res: express.Response): void {
  const claim: Claim = res.locals.claim
  const draft: Draft<ResponseDraft> = res.locals.responseDraft

  res.render(FullAdmissionPaths.paymentPlanPage.associatedView, {
    form: form,
    paymentLength: calculatePaymentPlanLength(form.model),
    monthlyIncome: _.get(draft, 'document.statementOfMeans.monthlyIncome', 0),
    monthlyExpenses: _.get(draft, 'document.statementOfMeans.monthlyExpenses', 0),
    totalAmount: claim.claimData.amount.totalAmount()
  })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(FullAdmissionPaths.paymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft
      renderView(new Form(draft.document.fullAdmission.paymentPlan), res)
    }))

  .post(FullAdmissionPaths.paymentPlanPage.uri,
    FeatureToggleGuard.anyFeatureEnabledGuard('fullAdmission'),
    FormValidator.requestHandler(DefendantPaymentPlan, DefendantPaymentPlan.fromObject, undefined, ['calculatePaymentPlan']),
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response): Promise<void> => {
        const form: Form<DefendantPaymentPlan> = req.body
        if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
          renderView(form, res)
        } else {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          const user: User = res.locals.user

          draft.document.fullAdmission.paymentPlan = form.model
          await new DraftService().save(draft, user.bearerToken)

          const { externalId } = req.params
          res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
        }
      }))

function calculatePaymentPlanLength (model: DefendantPaymentPlan): string {
  if (!model) {
    return undefined
  }

  const { totalAmount, instalmentAmount, paymentSchedule } = model
  if (totalAmount && instalmentAmount && paymentSchedule) {
    return createPaymentPlan(totalAmount, instalmentAmount, mapFrequencyInWeeks(paymentSchedule)).getPaymentLength()
  }

  return undefined
}
