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

import { AbstractModelAccessor } from 'shared/components/payment-intention/model-accessor'
import { PaymentIntention } from 'shared/components/payment-intention/model'

export abstract class AbstractPaymentOptionPage<Draft> {
  abstract getHeading (): string
  abstract createModelAccessor (): AbstractModelAccessor<Draft, PaymentIntention>
  abstract buildTaskListUri (req: express.Request, res: express.Response): string

  getView (): string {
    return 'components/payment-intention/payment-option'
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

              // if (option === DefendantPaymentType.IMMEDIATELY) {
              //   draft.document.statementOfMeans = undefined
              // }

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              const { externalId } = req.params
              switch (form.model.option) {
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

  private renderView (form: Form<PaymentOption>, res: express.Response) {
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
