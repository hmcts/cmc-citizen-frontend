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
import { Form, FormValidationError } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'

import { PaymentPlanHelper } from 'shared/helpers/paymentPlanHelper'
import { PaymentPlan } from 'common/payment-plan/paymentPlan'
import { Draft as DraftWrapper } from '@hmcts/draft-store-client'
import { ResponseDraft } from 'response/draft/responseDraft'

export abstract class AbstractPaymentPlanPage<Draft> {
  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildPostSubmissionUri (req: express.Request, res: express.Response): string
  postValidation (req: express.Request, res: express.Response): FormValidationError { return undefined }

  getView (): string {
    return 'components/payment-intention/payment-plan'
  }

  async saveDraft (locals: { user: User, draft: DraftWrapper<Draft> }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
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
            let form: Form<PaymentPlanModel> = req.body

            const error: FormValidationError = this.postValidation(req, res)

            if (error) {
              form = new Form<PaymentPlanModel>(form.model, [error, ...form.errors])
            }

            if (form.hasErrors() || _.get(req, 'body.action.calculatePaymentPlan')) {
              this.renderView(form, res)
            } else {
              this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentPlan = form.model)

              await this.saveDraft(res.locals)

              res.redirect(this.buildPostSubmissionUri(req, res))
            }
          }))
  }

  renderView (form: Form<PaymentPlanModel>, res: express.Response): void {
    const claim: Claim = res.locals.claim
    const draft: DraftWrapper<ResponseDraft> = res.locals.responseDraft
    const paymentPlan: PaymentPlan = PaymentPlanHelper.createPaymentPlanFromForm(form.model)
    const paymentLength: string = paymentPlan ? paymentPlan.calculatePaymentLength() : undefined
    let amount: number = claim.totalAmountTillToday
    let partAdmit: boolean = false
    if (draft && draft.document && draft.document.partialAdmission) {
      amount = draft.document.partialAdmission.howMuchDoYouOwe.amount
      partAdmit = true
    }
    res.render(this.getView(), {
      heading: this.getHeading(),
      form,
      partAdmit: partAdmit,
      totalAmount: amount,
      paymentLength,
      disposableIncome: res.locals.draft.document.courtDetermination ? res.locals.draft.document.courtDetermination.disposableIncome : undefined
    })
  }
}
