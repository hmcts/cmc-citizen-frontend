import * as express from 'express'
import { Paths } from 'claim/paths'

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
  .get(Paths.draftReceiptReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const documentsClient = await getDocumentsClient()
      const pdf: Buffer = await documentsClient.getDraftClaimReceiptPDF(externalId, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, `draft-claim-${externalId}`)
    }))
