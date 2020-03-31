import * as express from 'express'
import { ErrorHandling } from 'shared/errorHandling'
import { DocumentsClient } from 'documents/documentsClient'
import { Claim } from 'claims/models/claim'
import { DownloadUtils } from 'utils/downloadUtils'
import { Paths } from 'orders/paths'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.reviewOrderReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const pdf: Buffer = await documentsClient.getReviewOrderPdf(externalId, res.locals.user.bearerToken)

      const claim: Claim = res.locals.claim
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-review-order`)
    }))
