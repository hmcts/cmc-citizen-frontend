import * as express from 'express'
import * as _ from 'lodash'

import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentPlan as PaymentPlanModel } from 'shared/components/payment-intention/model/paymentPlan'
import { Paths } from 'shared/components/payment-intention/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { NotFoundError } from 'errors'

import { User } from 'idam/user'
import { Claim } from 'claims/models/claim'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'

import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'

export abstract class AbstractPaymentPlanPage<Draft> {
  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildPostSubmissionUri (req: express.Request, res: express.Response): string

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
      .get(path + Paths.paymentPlanPage.uri,
        ...guards,
        stateGuardRequestHandler,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentPlan), res)
        }))
      .post(path + Paths.paymentPlanPage.uri,
        ...guards,
        stateGuardRequestHandler,
        FormValidator.requestHandler(PaymentPlanModel, PaymentPlanModel.fromObject, undefined, ['calculatePaymentPlan']),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<PaymentPlanModel> = req.body
            if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
              this.renderView(form, res)
            } else {
              this.createModelAccessor().patch(res.locals.draft.document, model => {
                model.paymentPlan = form.model
                model.paymentPlan.completionDate = PaymentPlanHelper.createPaymentPlanFromForm(form.model).calculateLastPaymentDate()
              })

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              res.redirect(this.buildPostSubmissionUri(req, res))
            }
          }))
  }

  renderView (form: Form<PaymentPlanModel>, res: express.Response): void {
    const claim: Claim = res.locals.claim
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromForm(form.model)
    const paymentLength: string = paymentPlan ? paymentPlan.calculatePaymentLength() : undefined

    res.render(this.getView(), {
      heading: this.getHeading(),
      form,
      totalAmount: claim.totalAmountTillToday,
      paymentLength
    })
  }
}
