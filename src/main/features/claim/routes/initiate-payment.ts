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
import { FeatureToggles } from 'utils/featureToggles'

const logger = Logger.getLogger('router/initiate-payment')
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(noRetryRequest)

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.initiatePaymentController.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const user: User = res.locals.user
    const roles: string[] = await claimStoreClient.retrieveUserRoles(user)

    if (FeatureToggles.isEnabled('autoEnrolIntoNewFeature') && roles && !roles.some(role => role.includes('cmc-new-features-consent'))) {
      await claimStoreClient.addRoleToUser(user, 'cmc-new-features-consent-given')
    }
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
        if (paymentRef) {
          return res.redirect(Paths.startPaymentReceiver.uri)
        } else {
          const nextUrl: string = await claimStoreClient.initiatePayment(draft, user)
          logger.info('NEXT URL PAYMENT: ', nextUrl)
          return res.redirect(nextUrl)
        }
      } else {
        logger.error(`error retrieving claim with external id ${externalId}`)
        throw err
      }
    }

    if (ClaimState[existingClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
      const nextUrl: string = await claimStoreClient.resumePayment(draft, user)
      res.redirect(nextUrl)
    } else {
      res.redirect(Paths.confirmationPage.evaluateUri({ externalId }))
    }
  }))
