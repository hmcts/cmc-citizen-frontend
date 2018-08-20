import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { DocumentsClient } from 'documents/documentsClient'
import { Claim } from 'claims/models/claim'
import { DownloadUtils } from 'utils/downloadUtils'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const claim: Claim = res.locals.claim

      const filename: string = `${claim.claimNumber}-county-court-judgement`
      const pdf: Buffer = await documentsClient.getCountyCourtJudgementReceiptPDF(externalId, res.locals.user.bearerToken)

      DownloadUtils.downloadPDF(res, pdf, filename)
    }))
