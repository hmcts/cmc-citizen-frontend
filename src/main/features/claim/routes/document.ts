import * as express from 'express'
import { Paths } from 'claim/paths'

import { Claim } from 'claims/models/claim'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DocumentsClient } from 'documents/documentsClient'

import { ErrorHandling } from 'shared/errorHandling'

import { DownloadUtils } from 'utils/downloadUtils'
import * as _ from 'lodash'
import { ClaimDocument } from 'claims/models/claimDocument'

const documentsClient: DocumentsClient = new DocumentsClient()

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
      const pdf: Buffer = await documentsClient.getPDF(claim.externalId, document.documentType, document.subtype, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, document.documentName)
    }))
