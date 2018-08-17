import * as express from 'express'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { User } from 'main/app/idam/user'

import { ErrorHandling } from 'main/common/errorHandling'
import {
  DefendantPaymentType as PaymentType,
  DefendantPaymentOption as PaymentOption
} from 'response/form/models/defendantPaymentOption'
import { DraftService } from 'services/draftService'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'
import { RoutablePath } from 'shared/router/routablePath'

import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'

export abstract class AbstractPaymentOptionPage<Draft> {
  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildTaskListUri (req: express.Request, res: express.Response): string

  getView (): string {
    return 'components/payment-intention/payment-option'
  }

  buildPostSubmissionUri (path: string, req: express.Request, res: express.Response): string {
    const model: PaymentOption = req.body.model
    const { externalId } = req.params

    switch (model.option) {
      case PaymentType.IMMEDIATELY:
        return this.buildTaskListUri(req, res)
      case PaymentType.BY_SET_DATE:
        return new RoutablePath(path + PaymentIntentionPaths.paymentDatePage.uri).evaluateUri({ externalId: externalId })
      case PaymentType.INSTALMENTS:
        return new RoutablePath(path + PaymentIntentionPaths.paymentPlanPage.uri).evaluateUri({ externalId: externalId })
    }
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentOption), res)
        })
      .post(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        FormValidator.requestHandler(PaymentOption, PaymentOption.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<PaymentOption> = req.body

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {
              this.createModelAccessor().patch(res.locals.draft.document, model => model.paymentOption = form.model)

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              res.redirect(this.buildPostSubmissionUri(path, req, res))
            }
          }))
  }

  private renderView (form: Form<PaymentOption>, res: express.Response) {
    res.render(this.getView(), {
      form: form
    })
  }
}
