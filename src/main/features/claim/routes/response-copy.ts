import * as express from 'express'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'claim/paths'

import DocumentsClient from 'app/documents/documentsClient'
import ClaimStoreClient from 'app/claims/claimStoreClient'
import { ErrorHandling } from 'common/errorHandling'

const documentsClient: DocumentsClient = new DocumentsClient()

export default express.Router()
  .get(Paths.defendantResponseCopy.uri,
    ErrorHandling.apply(
      async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { externalId } = req.params
        // Check we are allowed to retrieve the document
        await ClaimStoreClient.retrieveByExternalId(externalId, res.locals.user.id)
        documentsClient.getResponseCopy(externalId)
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
              res.writeHead(HttpStatus.OK, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=defendant-response-copy.pdf',
                'Content-Length': pdf.length
              })

              res.end(pdf)
            })
          })
          .on('error', (err: Error) => {
            next(err)
          })
      }))
