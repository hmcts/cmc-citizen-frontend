import * as express from 'express'

import { Paths } from 'claim/paths'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { Claim } from 'claims/models/claim'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { ClaimState } from 'claims/models/claimState'
import { Logger } from '@hmcts/nodejs-logging'
import * as HttpStatus from 'http-status-codes'
import { ErrorHandling } from 'shared/errorHandling'
import { noRetryRequest } from 'client/request'
import { Payment } from 'payment-hub-client/payment'
import { DraftService } from 'services/draftService'
import { PaymentDetails } from 'claims/paymentDetails'

const logger = Logger.getLogger('router/initiate-payment')
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(noRetryRequest)

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.initiatePaymentController.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    const externalId: string = draft.document.externalId
    if (!externalId) {
      throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
    }
    let existingClaim: Claim
    try {
      existingClaim = await claimStoreClient.retrieveByExternalId(externalId, user)
    } catch (err) {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        const paymentRef = draft.document.claimant.payment ? draft.document.claimant.payment.reference : undefined
        logger.info(`payment for claim with external id ${externalId} is ${paymentRef}`)
        const payment: any = await claimStoreClient.initiatePayment(draft, user)

        draft.document.claimant.payment = Payment.deserialize(payment)
        new DraftService().save(draft, user.bearerToken)

        logger.info('RETURN URL PAYMENT: ', payment.nextUrl)
        return res.redirect(payment.nextUrl)
      } else {
        logger.error(`error retrieving claim with external id ${externalId}`)
        throw err
      }
    }

    if (ClaimState[existingClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
      const payment: PaymentDetails = await claimStoreClient.resumePayment(draft, user)
      draft.document.claimant.payment = Payment.deserialize(payment)
      await new DraftService().save(draft, user.bearerToken)
      res.redirect(payment.nextUrl)
    } else {
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId }))
    }
  }))
