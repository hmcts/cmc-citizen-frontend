import * as express from 'express'

import { Paths } from 'dashboard/paths'
import { ErrorHandling } from 'shared/errorHandling'

import { ClaimStoreClient } from 'claims/claimStoreClient'

import { User } from 'idam/user'

const claimStoreClient: ClaimStoreClient = new ClaimStoreClient()
const draftExternalId = 'draft'

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.contactThemPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params

    res.render(Paths.contactThemPage.associatedView, {
      claim: externalId !== draftExternalId ? await claimStoreClient.retrieveByExternalId(externalId, res.locals.user as User) : undefined
    })
  }))
  .post(Paths.contactThemPage.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
    const { externalId } = req.params

    if (externalId === draftExternalId) {
      throw new Error('Draft external ID is not supported')
    }

  }))
