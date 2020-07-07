import * as express from 'express'
import { Paths } from 'response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'
import { Claim } from 'claims/models/claim'
import { DownloadUtils } from 'utils/downloadUtils'

const scannedDocumentsClient: ScannedDocumentsClient = new ScannedDocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.scannedResponseForm.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const pdf: Buffer = await scannedDocumentsClient.getScannedResponseFormPDF(externalId, res.locals.user.bearerToken)

      const claim: Claim = res.locals.claim
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-scanned-response-form`)
    }))
