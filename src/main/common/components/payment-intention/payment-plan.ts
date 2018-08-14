import * as express from 'express'

import * as _ from 'lodash'

import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { Form } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { DefendantPaymentType as PaymentType } from 'response/form/models/defendantPaymentOption'
import { PaymentPlan } from 'shared/components/payment-intention/model/paymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { Claim } from 'claims/models/claim'
import { createPaymentPlan } from 'common/calculate-payment-plan/paymentPlan'
import { PaymentSchedule } from 'features/ccj/form/models/paymentSchedule'
import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { NotFoundError } from 'errors'

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

function calculatePaymentPlanLength (model: PaymentPlan): string {
  if (!model) {
    return undefined
  }

  const { totalAmount, instalmentAmount, paymentSchedule } = model
  if (totalAmount && instalmentAmount && paymentSchedule) {
    return createPaymentPlan(totalAmount, instalmentAmount, mapFrequencyInWeeks(paymentSchedule)).getPaymentLength()
  }

  return undefined
}

export abstract class AbstractPaymentPlanPage<Draft> {
  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildTaskListUri (req: express.Request, res: express.Response): string

  getView (): string {
    return 'components/payment-intention/payment-plan'
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
      const model: PaymentIntention = this.createModelAccessor().get(res.locals.draft.document)

      return model
        && model.paymentOption
        && model.paymentOption.isOfType(PaymentType.INSTALMENTS)
    }, (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })

    return express.Router()
      .get(path + PaymentIntentionPaths.paymentPlanPage.uri,
        ...guards,
        stateGuardRequestHandler,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentPlan), res)
        }))
      .post(path + PaymentIntentionPaths.paymentPlanPage.uri,
        ...guards,
        stateGuardRequestHandler,
        FormValidator.requestHandler(PaymentPlan, PaymentPlan.fromObject, undefined, ['calculatePaymentPlan']),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<PaymentPlan> = req.body
            if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
              this.renderView(form, res)
            } else {
              this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentPlan = form.model)

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              res.redirect(this.buildTaskListUri(req, res))
            }
          }))
  }

  renderView (form: Form<PaymentPlan>, res: express.Response): void {
    const claim: Claim = res.locals.claim

    res.render(this.getView(), {
      heading: this.getHeading(),
      form: form,
      totalAmount: claim.totalAmountTillToday,
      paymentLength: calculatePaymentPlanLength(form.model)
    })
  }
}
