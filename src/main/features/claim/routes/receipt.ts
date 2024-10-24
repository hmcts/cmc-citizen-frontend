import * as express from 'express'
import { Paths } from 'claim/paths'

import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DocumentsClient } from 'documents/documentsClient'

import { ErrorHandling } from 'shared/errorHandling'

import { DownloadUtils } from 'utils/downloadUtils'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.draftReceiptReceiver.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const { externalId } = req.params
      const pdf: Buffer = await documentsClient.getDraftClaimReceiptPDF(externalId, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, `draft-claim-${externalId}`)
    }))
