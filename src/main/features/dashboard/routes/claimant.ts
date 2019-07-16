import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { PartyType } from 'common/partyType'
import { User } from 'idam/user'
import { ForbiddenError } from 'errors'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const draftExternalId = 'draft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params

      const claim = externalId !== draftExternalId ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user as User) : undefined
      if (claim && claim.claimantId !== res.locals.user.id) {
        throw new ForbiddenError()
      }

      res.render(Paths.claimantPage.associatedView, {
        claim: claim
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
