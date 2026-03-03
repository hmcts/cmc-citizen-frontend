import * as express from 'express'
import { Paths } from 'claim/paths'

import { ClaimStoreClient } from 'claims/claimStoreClient'
import { Claim } from 'claims/models/claim'
import { User } from 'idam/user'
import { ErrorHandling } from 'shared/errorHandling'
import { DraftService } from 'services/draftService'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

async function getClaimStoreClient (): Promise<ClaimStoreClient> {
  const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
  return new ClaimStoreClient(undefined, serviceAuthToken)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.confirmationPage.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const user: User = res.locals.user
      const claimStoreClient = await getClaimStoreClient()
      const claim: Claim = await claimStoreClient.retrieveByExternalId(externalId, user)
      const drafts = await new DraftService().find('claim', '100', user.bearerToken, (value) => value)
      drafts.forEach(async draft => {
        await new DraftService().delete(draft.id, user.bearerToken)
      })
      res.render(Paths.confirmationPage.associatedView, { claim: claim })
    }))
