import * as express from 'express'

import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import {
  PaymentType,
  PaymentOption
} from 'shared/components/payment-intention/model/paymentOption'
import { Paths } from 'shared/components/payment-intention/paths'

import { ErrorHandling } from 'main/common/errorHandling'
import { RoutablePath } from 'shared/router/routablePath'

import { User } from 'main/app/idam/user'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { DraftService } from 'services/draftService'

export abstract class AbstractPaymentOptionPage<Draft> {
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
        return new RoutablePath(path + Paths.paymentDatePage.uri).evaluateUri({ externalId: externalId })
      case PaymentType.INSTALMENTS:
        return new RoutablePath(path + Paths.paymentPlanPage.uri).evaluateUri({ externalId: externalId })
    }
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + Paths.paymentOptionPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.createModelAccessor().get(res.locals.draft.document).paymentOption), res)
        })
      .post(path + Paths.paymentOptionPage.uri,
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
