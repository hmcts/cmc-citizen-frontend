import * as express from 'express'

import { Claim } from 'claims/models/claim'
import { DocumentsClient } from 'documents/documentsClient'

import { DownloadUtils } from 'utils/downloadUtils'

const documentsClient: DocumentsClient = new DocumentsClient()

export class SealedClaimPdfGenerator {

  /**
   * Handles sealed claim downloads
   *
   * Note: Middleware expects to have {@link Claim} available in {@link express.Response.locals}
   *
   * @param {e.Request} req HTTP request
   * @param {e.Response} res HTTP response
   * @returns {Promise<void>}
   */
  static async requestHandler (req: express.Request, res: express.Response): Promise<void> {
    const claim: Claim = res.locals.claim

    const pdf: Buffer = await documentsClient.getSealedClaimPDF(claim.externalId, res.locals.user.bearerToken)
    DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claim`)
  }
}
