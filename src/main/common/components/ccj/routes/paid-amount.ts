import * as express from 'express'

import { Form } from 'main/app/forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { PaidAmount } from 'main/features/ccj/form/models/paidAmount'
import { Paths } from 'shared/components/ccj/Paths'
import { Claim } from 'claims/models/claim'

import { Draft } from '@hmcts/draft-store-client'
import { DraftService } from 'services/draftService'

import { ErrorHandling } from 'main/common/errorHandling'

/* tslint:disable:no-default-export */
export abstract class AbstractPaidAmountPage {

  abstract buildRedirectUri (req: express.Request, res: express.Response): string

  buildRouter (path: string, ...guards: express.RequestHandler[]): express.Router {
    return express.Router()
      .get(
        path + Paths.paidAmountPage.uri,
        ErrorHandling.apply(async (req: express.Request, res: express.Response) => {
          const draft: Draft<any> = res.locals.draft

          this.renderView(new Form(draft.document.paidAmount), res)
        }))
      .post(
        path + Paths.paidAmountPage.uri,
        FormValidator.requestHandler(PaidAmount, PaidAmount.fromObject),
        ErrorHandling.apply(
          async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            const form: Form<PaidAmount> = req.body

            if (form.hasErrors()) {
              this.renderView(form, res)
            } else {
              const draft: Draft<any> = res.locals.draft
              const user: User = res.locals.user

              draft.document.paidAmount = form.model
              await new DraftService().save(draft, user.bearerToken)

              res.redirect(this.buildRedirectUri(req, res))
            }
          }))
  }

  private renderView (form: Form<PaidAmount>, res: express.Response) {
    const claim: Claim = res.locals.claim
    res.render('components/ccj/views/paid-amount', {
      form: form,
      totalAmount: claim.totalAmountTillToday
    })
  }

}
