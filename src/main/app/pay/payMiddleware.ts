import * as express from 'express'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { DraftService } from 'services/draftService'
import { Payment } from 'payment-hub-client/payment'
import { PaymentDetails } from 'claims/paymentDetails'

export class PayMiddleware {

  static requestHandler (): express.RequestHandler {
    return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      let draft: Draft<DraftClaim> = res.locals.claimDraft
      const payment = draft.document.claimant.payment
      if (payment && payment.reference && payment.status !== 'Failed') {
        const cancelledPayment: PaymentDetails = await new ClaimStoreClient().cancelPayment(draft, res.locals.user)
        draft.document.claimant.payment = Payment.deserialize(cancelledPayment)
        await new DraftService().save(draft, res.locals.user.bearerToken)
      }
      next()
    }
  }

}
