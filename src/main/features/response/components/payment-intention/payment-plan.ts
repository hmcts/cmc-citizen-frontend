import * as express from 'express'

import * as _ from 'lodash'

import { Paths } from 'response/paths'
import { Paths as PaymentIntentionPaths } from 'response/components/payment-intention/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DefendantPaymentType } from 'response/form/models/defendantPaymentOption'
import { DefendantPaymentPlan } from 'response/form/models/defendantPaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { createPaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
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

export class PaymentPlanPage {
  constructor (private admissionType: string) {
  }

  buildRouter (path: string = ''): express.Router {
    const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
      const draft: Draft<ResponseDraft> = res.locals.responseDraft

      return draft.document[this.admissionType]
        && draft.document[this.admissionType].paymentOption
        && draft.document[this.admissionType].paymentOption.isOfType(DefendantPaymentType.INSTALMENTS)
    }, (req: express.Request, res: express.Response): void => {
      const claim: Claim = res.locals.claim

      res.redirect(Paths.taskListPage.evaluateUri({ externalId: claim.externalId }))
    })

    return express.Router()
      .get(path + PaymentIntentionPaths.paymentPlanPage.uri,
        FeatureToggleGuard.featureEnabledGuard('admissions'),
        stateGuardRequestHandler,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const draft: Draft<ResponseDraft> = res.locals.responseDraft
          this.renderView(new Form(draft.document[this.admissionType].paymentPlan), res)
        }))
      .post(path + PaymentIntentionPaths.paymentPlanPage.uri,
        FeatureToggleGuard.featureEnabledGuard('admissions'),
        stateGuardRequestHandler,
        FormValidator.requestHandler(DefendantPaymentPlan, DefendantPaymentPlan.fromObject, undefined, ['calculatePaymentPlan']),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<DefendantPaymentPlan> = req.body
            if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
              this.renderView(form, res)
            } else {
              const draft: Draft<ResponseDraft> = res.locals.responseDraft
              const user: User = res.locals.user

              draft.document[this.admissionType].paymentPlan = form.model
              await new DraftService().save(draft, user.bearerToken)

              const { externalId } = req.params
              res.redirect(Paths.taskListPage.evaluateUri({ externalId: externalId }))
            }
          }))
  }

  renderView (form: Form<DefendantPaymentPlan>, res: express.Response): void {
    const claim: Claim = res.locals.claim
    const draft: Draft<ResponseDraft> = res.locals.responseDraft

    res.render('response/components/payment-intention/payment-plan', {
      form: form,
      paymentLength: calculatePaymentPlanLength(form.model),
      monthlyIncome: _.get(draft, 'document.statementOfMeans.monthlyIncome', 0),
      monthlyExpenses: _.get(draft, 'document.statementOfMeans.monthlyExpenses', 0),
      totalAmount: claim.totalAmountTillToday
    })
  }
}
