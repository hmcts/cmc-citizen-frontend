import * as express from 'express'
import { Paths } from 'claim/paths'

import { Claim } from 'claims/models/claim'
import { ClaimMiddleware } from 'claims/claimMiddleware'
import { DocumentsClient } from 'documents/documentsClient'

import { ErrorHandling } from 'shared/errorHandling'

import { DownloadUtils } from 'utils/downloadUtils'
import { UUIDUtils } from 'shared/utils/uuidUtils'
import * as _ from 'lodash'
import { ClaimDocument } from 'claims/models/claimDocument'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.documentPage.uri,
    ClaimMiddleware.retrieveByExternalId,
    ErrorHandling.apply(async (req: express.Request, res: express.Response): Promise<void> => {
      const claim: Claim = res.locals.claim
      const documentId = UUIDUtils.extractDocumentId(req.path)
      const document: ClaimDocument = _.find(claim.claimDocuments,{ id : documentId })
      const pdf: Buffer = await documentsClient.getPDF(claim.externalId, document.documentType, res.locals.user.bearerToken)
      DownloadUtils.downloadPDF(res, pdf, document.documentName)
    }))
