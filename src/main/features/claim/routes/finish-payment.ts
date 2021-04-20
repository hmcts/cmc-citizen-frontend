import * as express from 'express'

import { Paths } from 'claim/paths'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { User } from 'idam/user'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Logger } from '@hmcts/nodejs-logging'
import { Claim } from 'claims/models/claim'
import { ClaimState } from 'claims/models/claimState'
import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import * as HttpStatus from 'http-status-codes'
import { ErrorHandling } from 'shared/errorHandling'
import { noRetryRequest } from 'client/request'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(noRetryRequest)
const launchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
const featuresBuilder: FeaturesBuilder = new FeaturesBuilder(claimStoreClient, launchDarklyClient)

const logger = Logger.getLogger('router/finish-payment')

/* tslint:disable:no-default-export */
// noinspection JSUnusedGlobalSymbols
export default express.Router()
  .get(Paths.finishPaymentController.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

    const { externalId } = req.params
    const user: User = res.locals.user
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    try {
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      logger.info(`CLAIM IN FINISH PAYMENT, Payment state for external id (${externalId}): `, claim.state)
      if (ClaimState[claim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
        const features = await featuresBuilder.features(claim.claimData.amount.totalAmount(), user)

        const createdClaim = await claimStoreClient.createCitizenClaim(draft, user, features)
        if (ClaimState[createdClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
          res.redirect(Paths.checkAndSendPage.uri)
        } else {
          await new DraftService().delete(draft.id, user.bearerToken)
          res.redirect(Paths.confirmationPage.evaluateUri({ externalId }))
        }
      } else {
        if (draft && draft.id) {
          await new DraftService().delete(draft.id, user.bearerToken)
        }
        res.redirect(Paths.confirmationPage.evaluateUri({ externalId }))
      }
    } catch (err) {
      if (err.statusCode === HttpStatus.NOT_FOUND) {
        logger.log(`claim with external id ${externalId} not found, redirecting user to check and send`)
        res.redirect(Paths.checkAndSendPage.uri)
      } else {
        next(err)
      }
    }
  }))
