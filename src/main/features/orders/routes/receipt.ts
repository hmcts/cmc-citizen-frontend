import * as express from 'express'
import { Paths } from 'orders/paths'

import { Claim } from 'claims/models/claim'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DocumentsClient } from 'documents/documentsClient'

import { ErrorHandling } from 'shared/errorHandling'

import { DownloadUtils } from 'utils/downloadUtils'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

async function getDocumentsClient (): Promise<DocumentsClient> {
  const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
  return new DocumentsClient(undefined, serviceAuthToken)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.directionsOrderDocument.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const claim: Claim = res.locals.claim

      const documentsClient = await getDocumentsClient()
      const pdf: Buffer = await documentsClient.getDirectionsOrder(claim.externalId, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claim-direction-order`)
    }))
