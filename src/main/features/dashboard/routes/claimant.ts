import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { PartyType } from 'common/partyType'
import { User } from 'idam/user'
import { ForbiddenError } from 'errors'
import { Moment } from 'moment'
import { DirectionOrder } from 'claims/models/directionOrder'
import { DraftClaim } from 'drafts/models/draftClaim'
import { DraftService } from 'services/draftService'
import { Draft } from '@hmcts/draft-store-client'
import { prepareClaimDraft } from 'drafts/draft-data/claimDraft'
import { BreathingSpace } from 'features/claim/form/models/breathingSpace'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const draftExternalId = 'draft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const claim = externalId !== draftExternalId ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user as User) : undefined
      const mediationDeadline: Moment = claim ? await claim.respondToMediationDeadline() : undefined
      const reconsiderationDeadline: Moment = claim ? await claim.respondToReconsiderationDeadline() : undefined
      const isReviewOrderEligible: boolean = DirectionOrder.isReviewOrderEligible(reconsiderationDeadline)
      const judgePilot: boolean = claim ? claim.features !== undefined && claim.features.includes('judgePilotEligible') : false

      const respondToReviewOrderDeadline: Moment = claim ? await claim.respondToReviewOrderDeadline() : undefined
      res.app.locals.breathingSpaceExternalId = externalId
      res.app.locals.breathingSpaceEndDate = null
      res.app.locals.breathingSpaceEnteredDate = null
      res.app.locals.breathingSpaceReferenceNumber = ''
      res.app.locals.breathingSpaceType = null

      let draft: Draft<DraftClaim> = res.locals.bsDraft
      const user: User = res.locals.user
      const drafts = await new DraftService().find('bs', '100', user.bearerToken, (value) => value)
      drafts.forEach(async bsDraft => {
        await new DraftService().delete(bsDraft.id, user.bearerToken)
      })
      draft.document = new DraftClaim().deserialize(prepareClaimDraft(user.email, false))
      draft.document.breathingSpace = claim.claimData.breathingSpace
      if (draft.document.breathingSpace) {
        draft.document.breathingSpace.breathingSpaceExternalId = externalId
      } else {
        draft.document.breathingSpace = new BreathingSpace()
        draft.document.breathingSpace.breathingSpaceExternalId = externalId
      }
      await new DraftService().save(draft, user.bearerToken)

      if (claim && claim.claimantId !== res.locals.user.id) {
        throw new ForbiddenError()
      }
      res.render(Paths.claimantPage.associatedView, {
        claim: claim,
        mediationDeadline: mediationDeadline,
        reconsiderationDeadline: reconsiderationDeadline,
        isReviewOrderEligible: isReviewOrderEligible,
        respondToReviewOrderDeadline: respondToReviewOrderDeadline,
        judgePilot: judgePilot
      })
    }))
  .post(Paths.claimantPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params

      if (externalId === draftExternalId) {
        throw new Error('Draft external ID is not supported')
      }

      const user: User = res.locals.user
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      if (claim && claim.claimantId !== user.id) {
        throw new ForbiddenError()
      }

      if (claim.claimData.defendant.type === PartyType.INDIVIDUAL.value && !claim.retrieveDateOfBirthOfDefendant) {
        res.redirect(CCJPaths.dateOfBirthPage.evaluateUri({ externalId: externalId }))
      } else {
        res.redirect(CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId }))
      }
    }))
