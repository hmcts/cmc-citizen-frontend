import * as express from 'express'
import { Form } from 'main/app/forms/form'
import { FormValidator } from 'main/app/forms/validation/formValidator'
import { User } from 'main/app/idam/user'

import { ErrorHandling } from 'main/common/errorHandling'
import {
  DefendantPaymentOption,
  DefendantPaymentType as PaymentType,
  DefendantPaymentOption as PaymentOption
} from 'response/form/models/defendantPaymentOption'
import { DraftService } from 'services/draftService'
import { Paths as PaymentIntentionPaths } from 'shared/components/payment-intention/paths'
import { RoutablePath } from 'shared/router/routablePath'

export abstract class AbstractPaymentOptionPage {
  abstract getModel (res: express.Response): PaymentOption
  abstract saveModel (res: express.Response, model: PaymentOption): void

  getView (): string {
    return 'components/payment-intention/payment-option'
  }

  buildTaskListUri (req: express.Request, res: express.Response): string {
    return '/task-list'
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.getModel(res)), res)
        })
      .post(path + PaymentIntentionPaths.paymentOptionPage.uri,
        ...guards,
        FormValidator.requestHandler(DefendantPaymentOption, DefendantPaymentOption.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<DefendantPaymentOption> = req.body

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {
              this.saveModel(res, form.model)

              // if (option === DefendantPaymentType.IMMEDIATELY) {
              //   draft.document.statementOfMeans = undefined
              // }

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              const { externalId } = req.params
              switch (this.getModel(res).option) {
                case PaymentType.IMMEDIATELY:
                  return res.redirect(new RoutablePath(this.buildTaskListUri(req, res)).evaluateUri({ externalId: externalId }))
                case PaymentType.BY_SET_DATE:
                  return res.redirect(new RoutablePath(path + PaymentIntentionPaths.paymentDatePage.uri).evaluateUri({ externalId: externalId }))
                case PaymentType.INSTALMENTS:
                  return res.redirect(new RoutablePath(this.buildTaskListUri(req, res)).evaluateUri({ externalId: externalId }))
              }
            }
          }))
  }

  private renderView (form: Form<DefendantPaymentOption>, res: express.Response) {
    // function isApplicableFor (draft: ResponseDraft): boolean {
    //   if (!FeatureToggles.isEnabled('statementOfMeans')) {
    //     return false
    //   }
    //   return draft.isResponseFullyAdmitted()
    //     && !draft.defendantDetails.partyDetails.isBusiness()
    // }

    res.render(this.getView(), {
      form: form
      // statementOfMeansIsApplicable: isApplicableFor(draft.document)
    })
  }
}
