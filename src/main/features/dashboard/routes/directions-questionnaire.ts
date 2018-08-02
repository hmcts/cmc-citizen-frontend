import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'

const page = Paths.directionsQuestionnairePage

/* tslint:disable:no-default-export */
export default express.Router()
  .get(
    page.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claim: Claim = await new ClaimStoreClient().retrieveByExternalId(externalId, user)

      res.render(page.associatedView, {
        deadline: claim.respondedAt.add(19, 'days'),
        claimNumber: claim.claimNumber,
        citizenName: user.forename + ' ' + user.surname
      })
    }))
