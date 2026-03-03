import * as express from 'express'
import { Paths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'
import { Claim } from 'claims/models/claim'
import { DownloadUtils } from 'utils/downloadUtils'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'
import * as requestPromise from 'request-promise-native'

async function getScannedDocumentsClient (): Promise<ScannedDocumentsClient> {
  const serviceAuthToken = await new ServiceAuthTokenFactoryImpl().get()
  return new ScannedDocumentsClient(undefined, requestPromise, serviceAuthToken)
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.scannedResponseForm.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const scannedDocumentsClient = await getScannedDocumentsClient()
      const pdf: Buffer = await scannedDocumentsClient.getScannedResponseFormPDF(externalId, res.locals.user.bearerToken)

      const claim: Claim = res.locals.claim
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-scanned-response-form`)
    }))
