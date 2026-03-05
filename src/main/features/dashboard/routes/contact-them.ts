import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'

import { User } from 'idam/user'

import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

async function getClaimStoreClient () {
  const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
  return new ClaimStoreClient(undefined, serviceAuthToken)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.contactThemPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params
    const claimStoreClient = await getClaimStoreClient()
    res.render(Paths.contactThemPage.associatedView, {
      claim: await claimStoreClient.retrieveByExternalId(externalId, res.locals.user as User)
    })
  }))
