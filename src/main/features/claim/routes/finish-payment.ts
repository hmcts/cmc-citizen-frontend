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

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()

const logger = Logger.getLogger('router/finish-payment')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.finishPaymentController.uri, async (req, res, next) => {
    const { externalId } = req.params
    const user: User = res.locals.user
    const draft: Draft<DraftClaim> = res.locals.claimDraft

    try {
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)

      if (ClaimState[claim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
        const features = await FeaturesBuilder.features(draft, user)

        const createdClaim = await claimStoreClient.createCitizenClaim(draft, user, features)
        if (ClaimState[createdClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
          res.redirect(Paths.checkAndSendPage.uri)
        } else {
          await new DraftService().delete(draft.id, user.bearerToken)
          res.redirect(Paths.confirmationPage.evaluateUri({ externalId }))
        }
      } else {
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
  })
