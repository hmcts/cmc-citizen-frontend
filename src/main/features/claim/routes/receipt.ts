import * as express from 'express'
import { Paths } from 'claim/paths'
import { ErrorHandling } from 'common/errorHandling'
import { DocumentsClient } from 'app/documents/documentsClient'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'
import { Claim } from 'claims/models/claim'

const documentsClient: DocumentsClient = new DocumentsClient()

/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.receiptReceiver.uri,
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        const { externalId } = req.params
        documentsClient.getClaimIssueReceiptPDF(externalId, res.locals.user.bearerToken)
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
              const claim: Claim = res.locals.claim
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
      }))
