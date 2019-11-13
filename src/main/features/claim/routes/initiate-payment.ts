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

const logger = Logger.getLogger('router/initiate-payment')
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.initiatePaymentController.uri, async (req, res, next) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    const externalId: string = draft.document.externalId
    if (!externalId) {
      throw new Error(`externalId is missing from the draft claim. User Id : ${user.id}`)
    }
    try {
      const existingClaim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)

      if (ClaimState[existingClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
        const nextUrl: string = await claimStoreClient.resumePayment(draft, user)
        res.redirect(nextUrl)
      } else {
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId: externalId }))
      }
    } catch (err) {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        const payment = draft.document.claimant.payment
        if (payment !== undefined && payment.status === 'Success') {
          res.redirect(Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
        } else {
          const nextUrl: string = await claimStoreClient.initiatePayment(draft, user)
          res.redirect(nextUrl)
        }
      } else {
        logger.error(`claim with external id ${externalId} not found, redirecting user to check and send`)
        res.redirect(Paths.checkAndSendPage.uri)
      }
    }
  })
