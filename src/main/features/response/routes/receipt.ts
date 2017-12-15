import * as express from 'express'
import { Paths } from 'response/paths'
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
        documentsClient.getDefendantResponseReceiptPDF(externalId)
          .on('response', (response: http.IncomingMessage) => {
            if (response.statusCode !== 200) {
              return next(new Error('Unexpected error during document retrieval'))
            }
            const buffers: Buffer[] = []
            response.on('data', (chunk: Buffer) => {
              buffers.push(chunk)
            })
            response.on('end', () => {
              const pdf = Buffer.concat(buffers)
              const claim: Claim = res.locals.claim
              res.writeHead(HttpStatus.OK, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=${claim.claimNumber}-response-receipt.pdf`,
                'Content-Length': pdf.length
              })

              res.end(pdf)
            })
          })
          .on('error', (err: Error) => {
            next(err)
          })
      }))
