import * as express from 'express'
import { Paths } from 'claimant-response/paths'
import { Claim } from 'claims/models/claim'
import { DocumentsClient } from 'documents/documentsClient'
import { ErrorHandling } from 'shared/errorHandling'
import { DownloadUtils } from 'utils/downloadUtils'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.claimantReceiptReceiver.uri,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const claim: Claim = res.locals.claim

      const pdf: Buffer = await documentsClient.getClaimantHearingRequirementPDF(claim.externalId, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claim-form-claimant-copy`)
    }))
