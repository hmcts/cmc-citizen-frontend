import * as express from 'express'
import { Paths } from 'offer/paths'
import { ErrorHandling } from 'shared/errorHandling'
import { DocumentsClient } from 'documents/documentsClient'
import { Claim } from 'claims/models/claim'
import { DownloadUtils } from 'utils/downloadUtils'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.agreementReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const { externalId } = req.params
      const pdf: Buffer = await documentsClient.getSettlementAgreementPDF(externalId, res.locals.user.bearerToken)

      const claim: Claim = res.locals.claim
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-settlement-agreement`)
    }))
