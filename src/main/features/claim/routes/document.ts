import * as express from 'express'
import { Paths } from 'claim/paths'

import { Claim } from 'claims/models/claim'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DocumentsClient } from 'documents/documentsClient'

import { ErrorHandling } from 'shared/errorHandling'

import { DownloadUtils } from 'utils/downloadUtils'
import * as _ from 'lodash'
import { ClaimDocument } from 'claims/models/claimDocument'
import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'

const documentsClient: DocumentsClient = new DocumentsClient()
const scannedDocumentsClient: ScannedDocumentsClient = new ScannedDocumentsClient()

function getDocumentPath (path: string): string {
  return path.match(`[^\/]+$`)[0]
}
/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.documentPage.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const claim: Claim = res.locals.claim
      const documentURI = getDocumentPath(req.path)
      const document: ClaimDocument = _.find(claim.claimDocuments,{ uri : documentURI })
      const pdf: Buffer = await getPDF(claim.externalId, document, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, document.documentName)
    }))

async function getPDF (claimExternalId: string, document: ClaimDocument, bearerToken: string): Promise<Buffer> {
  if (document.documentType === 'GENERAL_LETTER') {
    return documentsClient.getPDF(claimExternalId, document.uri, bearerToken)
  } else if (document.subtype) {
    return scannedDocumentsClient.getScannedPDF(claimExternalId, document.documentType, document.subtype, bearerToken)
  } else {
    return documentsClient.getPDF(claimExternalId, document.documentType, bearerToken)
  }

}
