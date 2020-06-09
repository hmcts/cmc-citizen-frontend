import * as express from 'express'
import { Paths } from 'claim/paths'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Form } from 'forms/form'
import { FormValidator } from 'forms/validation/formValidator'
import { ErrorHandling } from 'shared/errorHandling'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { PaymentMethod } from 'claim/form/models/paymentMethod'
import { FeatureToggles } from 'utils/featureToggles'

function renderView (form: Form<PaymentMethod>, res: express.Response): void {
  const draft: Draft<DraftClaim> = res.locals.claimDraft
  const paymentMethod = draft.document && draft.document.paymentMethod ? draft.document.paymentMethod : ''

  res.render(Paths.paymentMethodPage.associatedView, { form, paymentMethod })
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.paymentMethodPage.uri, (req: express.Request, res: express.Response): void => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    renderView(new Form(draft.document.paymentMethod), res)
  })
  .post(
    Paths.paymentMethodPage.uri,
    FormValidator.requestHandler(PaymentMethod),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<PaymentMethod> = req.body

      if (form.hasErrors()) {
        renderView(form, res)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user

        draft.document.paymentMethod = new PaymentMethod().deserialize(form.model)
        await new DraftService().save(draft, user.bearerToken)

        if (draft.document.paymentMethod.helpWithFees) {
          res.redirect(Paths.confirmHelpWithFeesPage.uri)
        } else {
          if (FeatureToggles.isEnabled('inversionOfControl')) {
            res.redirect(Paths.initiatePaymentController.uri)
          } else {
            res.redirect(Paths.startPaymentReceiver.uri)
          }
        }
      }
    }))
