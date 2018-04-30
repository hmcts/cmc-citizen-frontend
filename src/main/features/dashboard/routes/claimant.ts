import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { Paths as CCJPaths } from 'ccj/paths'
import { ErrorHandling } from 'common/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'app/claims/models/claim'
import { PartyType } from 'app/common/partyType'
import { User } from 'idam/user'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const draftExternalId = 'draft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params

    res.render(Paths.claimantPage.associatedView, {
      claim: externalId !== draftExternalId ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user as User) : undefined
    })
  }))
  .post(Paths.claimantPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params

    if (externalId === draftExternalId) {
      throw new Error('Draft external ID is not supported')
    }

    const user: User = res.locals.user
    const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)

    if (claim.claimData.defendant.type === PartyType.INDIVIDUAL.value) {
      res.redirect(CCJPaths.dateOfBirthPage.evaluateUri({ externalId: externalId }))
    } else {
      res.redirect(CCJPaths.paidAmountPage.evaluateUri({ externalId: externalId }))
    }
  }))
