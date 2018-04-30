import * as express from 'express'

import { Claim } from 'app/claims/models/claim'
import { DocumentsClient } from 'app/documents/documentsClient'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

const documentsClient: DocumentsClient = new DocumentsClient()

export class ClaimIssueReceiptPDFGenerator {

  /**
   * Handles claim issue receipt downloads
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

    documentsClient.getClaimIssueReceiptPDF(claim.externalId, res.locals.user.bearerToken)
      .on('response', (response: http.IncomingMessage) => {
        if (response.statusCode !== HttpStatus.OK) {
          return next(
            new Error(response.statusMessage ? response.statusMessage : 'Unexpected error during document retrieval')
          )
        }
        const buffers: Buffer[] = []
        response.on('data', (chunk: Buffer) => {
          buffers.push(chunk)
        })
        response.on('end', () => {
          const pdf = Buffer.concat(buffers)
          res.writeHead(HttpStatus.OK, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${claim.claimNumber}-claim-form-claimant-copy.pdf`,
            'Content-Length': pdf.length
          })

          res.end(pdf)
        })
      })
      .on('error', (err: Error) => {
        next(err)
      })
  }
}
