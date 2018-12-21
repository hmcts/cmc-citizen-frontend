import * as express from 'express'

import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { Paths } from 'shared/components/payment-intention/paths'

import { GuardFactory } from 'response/guards/guardFactory'
import { ErrorHandling } from 'shared/errorHandling'
import { NotFoundError } from 'errors'

import { User } from 'idam/user'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { DraftService } from 'services/draftService'
import { Draft as DraftWrapper } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'

export abstract class AbstractPaymentDatePage<Draft> {

  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildPostSubmissionUri (req: express.Request, res: express.Response): string

  getNotice (): string {
    return undefined
  }

  getView (): string {
    return 'components/payment-intention/payment-date'
  }

  async saveDraft (locals: { user: User, draft: DraftWrapper<Draft>,claim: Claim }): Promise<void> {
    const user: User = locals.user
    await new DraftService().save(locals.draft, user.bearerToken)
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
      const model: PaymentIntention = this.createModelAccessor().get(res.locals.draft.document)

      return model && model.paymentOption && model.paymentOption.isOfType(PaymentType.BY_SET_DATE)
    }, (req: express.Request): void => {
      throw new NotFoundError(req.path)
    })

    return express.Router()
      .get(
        path + Paths.paymentDatePage.uri,
        ...guards,
        stateGuardRequestHandler,
        (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentDate), res)
        })
      .post(
        path + Paths.paymentDatePage.uri,
        ...guards,
        stateGuardRequestHandler,
        FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const form: Form<PaymentDate> = req.body

          if (form.hasErrors()) {
            this.renderView(form, res)
          } else {
            this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentDate = form.model)

            await this.saveDraft(res.locals)

            res.redirect(this.buildPostSubmissionUri(req, res))
          }
        }))
  }

  private renderView (form: Form<PaymentDate>, res: express.Response) {
    const notice: string = this.getNotice()
    res.render(this.getView(), {
      heading: this.getHeading(),
      form: form,
      notice: notice ? notice : undefined,
      disposableIncome: res.locals.draft.document.courtDetermination ? res.locals.draft.document.courtDetermination.disposableIncome : undefined
    })
  }
}
