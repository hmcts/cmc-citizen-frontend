import * as express from 'express'
import { Moment } from 'moment'

import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'

import { NotFoundError } from 'errors'
import { ErrorHandling } from 'shared/errorHandling'
import { MomentFactory } from 'shared/momentFactory'

import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PaymentDate } from 'shared/components/payment-intention/model/paymentDate'
import { User } from 'idam/user'

import { DefendantPaymentType as PaymentType } from 'response/form/models/defendantPaymentOption'
import { GuardFactory } from 'response/guards/guardFactory'
import { DraftService } from 'services/draftService'

export abstract class AbstractPaymentDatePage<Draft> {

  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildTaskListUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    const stateGuardRequestHandler: express.RequestHandler = GuardFactory.create((res: express.Response): boolean => {
      const model: PaymentIntention = this.createModelAccessor().get(res.locals.draft.document)

      return model && model.paymentOption && model.paymentOption.isOfType(PaymentType.BY_SET_DATE)
    }, (req: express.Request, res: express.Response): void => {
      throw new NotFoundError(req.path)
    })

    return express.Router()
      .get(
        path + PaymentIntentionPaths.paymentDatePage.uri,
        ...guards,
        stateGuardRequestHandler,
        (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentDate), res)
        })
      .post(
        path + PaymentIntentionPaths.paymentDatePage.uri,
        ...guards,
        stateGuardRequestHandler,
        FormValidator.requestHandler(PaymentDate, PaymentDate.fromObject),
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const form: Form<PaymentDate> = req.body
          if (form.hasErrors()) {
            this.renderView(form, res)
          } else {
            this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentDate = form.model)

            const user: User = res.locals.user
            await new DraftService().save(res.locals.draft, user.bearerToken)

            res.redirect(this.buildTaskListUri(req, res))
          }
        }))
  }

  private renderView (form: Form<PaymentDate>, res: express.Response) {
    const futureDate: Moment = MomentFactory.currentDate().add(1, 'month')

    res.render('components/payment-intention/payment-date', {
      heading: this.getHeading(),
      form: form,
      futureDate: futureDate
    })
  }
}
