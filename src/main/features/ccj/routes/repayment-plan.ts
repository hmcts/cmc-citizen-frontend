import * as express from 'express'
import { Paths } from 'ccj/paths'

import { ErrorHandling } from 'shared/errorHandling'
import { Form, FormValidationError } from 'forms/form'
import { DraftService } from 'services/draftService'
import { User } from 'idam/user'
import { PaidAmount } from 'ccj/form/models/paidAmount'
import { RepaymentPlan } from 'ccj/form/models/repaymentPlan'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftCCJ } from 'ccj/draft/draftCCJ'
import { Draft as DraftWrapper, Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { Moment } from 'moment'
import { getEarliestPaymentDateForPaymentPlan } from 'claimant-response/helpers/paydateHelper'
import { ValidationError } from '@hmcts/class-validator'

class RepaymentPlanPage {
  getHeading (): string {
    return 'Your repayment plan'
  }
  buildPostSubmissionUri (req: express.Request, res: express.Response): string {
    const { externalId } = req.params
    return Paths.checkAndSendPage.evaluateUri({ externalId: externalId })
  }
  postValidation (req: express.Request, res: express.Response): FormValidationError {
    const model = req.body.model
    if (model.firstPaymentDate) {
      const validDate: Moment = getEarliestPaymentDateForPaymentPlan(res.locals.claim, model.firstPaymentDate.toMoment())
      if (validDate && validDate > model.firstPaymentDate.toMoment()) {
        const error: ValidationError = {
          target: model,
          property: 'firstPaymentDate',
          value: model.firstPaymentDate.toMoment(),
          constraints: { 'Failed': 'Enter a date of  ' + validDate.format('DD MM YYYY') + ' or later for the first instalment' },
          children: undefined
        }
        return new FormValidationError(error)
      }
    }
    return undefined
  }

  getView (): string {
    return Paths.repaymentPlanPage.associatedView
  }

  async saveDraft (locals: { user: User, draft: DraftWrapper<DraftCCJ> }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
  }

  buildRouter (): express.Router {

    return express.Router()
      .get(Paths.repaymentPlanPage.uri,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const draft: Draft<DraftCCJ> = res.locals.ccjDraft
          this.renderView(new Form(draft.document.repaymentPlan), res)
        }))
      .post(Paths.repaymentPlanPage.uri,
        FormValidator.requestHandler(RepaymentPlan, RepaymentPlan.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            let form: Form<PaidAmount> = req.body
            const error: FormValidationError = this.postValidation(req, res)

            if (error) {
              form = new Form<PaidAmount>(form.model, [error, ...form.errors])
            }

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {

              res.locals.draft.document.repaymentPlan = form.model
              res.locals.draft.document.payBySetDate = undefined
              await this.saveDraft(res.locals)

              res.redirect(this.buildPostSubmissionUri(req, res))
            }
          })
      )
  }

  renderView (form: Form<PaidAmount>, res: express.Response): void {
    const claim: Claim = res.locals.claim
    const draft: Draft<DraftCCJ> = res.locals.ccjDraft
    const alreadyPaid: number = draft.document.paidAmount.amount || 0

    res.render(this.getView(), {
      heading: this.getHeading(),
      form: form,
      remainingAmount: claim.totalAmountTillToday - alreadyPaid
    })
  }

}
/* tslint:disable:no-default-export */
export default new RepaymentPlanPage()
  .buildRouter()
