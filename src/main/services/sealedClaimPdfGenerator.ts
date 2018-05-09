import * as express from 'express'
import * as http from 'http'

import { Claim } from 'claims/models/claim'
import { DocumentsClient } from 'documents/documentsClient'
import { pdfEndpointResponseHandler } from 'services/pdfEndpointsResponseHandler'

const documentsClient: DocumentsClient = new DocumentsClient()

export class SealedClaimPdfGenerator {

  /**
   * Handles sealed claim downloads
   *
   * Note: Middleware expects to have {@link Claim} available in {@link express.Response.locals}
   *
   * @param {e.Request} req HTTP request
   * @param {e.Response} res HTTP response
   * @param {e.NextFunction} next next handler
   * @returns {Promise<void>}
   */
  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const claim: Claim = res.locals.claim

    try {
      documentsClient.getSealedClaimPDF(claim.externalId, res.locals.user.bearerToken)
        .on('response', (response: http.IncomingMessage) => {
          try {
            pdfEndpointResponseHandler(`sealed-claim-${claim.claimNumber}`, res)(response)
          } catch (err) {
            next(err)
          }
        })
        .on('error', (err: Error) => {
          next(err)
        })
    } catch (error) {
      next(error)
    }

  }
}
