import * as express from 'express'

import { Form } from 'main/app/forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PaidAmount } from 'main/features/ccj/form/models/paidAmount'
import { Paths } from 'shared/components/ccj/Paths'
import { Claim } from 'claims/models/claim'

import { DraftService } from 'services/draftService'

import { ErrorHandling } from 'main/common/errorHandling'
import { AbstractModelAccessor } from 'shared/components/model-accessor'
import { RoutablePath } from 'shared/router/routablePath'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountPage<Draft> {

  abstract paidAmount (): AbstractModelAccessor<Draft, PaidAmount>
  abstract totalAmount (claim: Claim, draft: Draft): number

  getView (): string {
    return 'components/ccj/paid-amount'
  }

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + Paths.paidAmountPage.uri,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          this.renderView(new Form(this.paidAmount().get(res.locals.draft.document)), res)
        }))
      .post(
        path + Paths.paidAmountPage.uri,
        FormValidator.requestHandler(PaidAmount, PaidAmount.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response): Promise<void> => {
            const form: Form<PaidAmount> = req.body

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {
              this.paidAmount().set(res.locals.draft.document, form.model)

              const user: User = res.locals.user
              await new DraftService().save(res.locals.draft, user.bearerToken)

              const { externalId } = req.params
              res.redirect(new RoutablePath(path + Paths.paidAmountSummaryPage.uri).evaluateUri({ externalId: externalId }))
            }
          }))
  }

  private renderView (form: Form<PaidAmount>, res: express.Response) {
    const claim: Claim = res.locals.claim
    res.render(this.getView(), {
      form: form,
      totalAmount: this.totalAmount(claim, res.locals.draft.document)
    })
  }

}
