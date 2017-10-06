import * as express from 'express'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'claim/paths'

import ClaimStoreClient from 'app/claims/claimStoreClient'
import Claim from 'app/claims/models/claim'

import PdfClient from 'app/pdf/pdfClient'
import IssueReceipt from 'app/pdf/issueReceipt'
import OwnershipChecks from 'app/auth/ownershipChecks'

export default express.Router()
  .get(Paths.receiptReceiver.uri, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    try {
      const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)
      OwnershipChecks.checkClaimOwner(res.locals.user, claim)

      new PdfClient().generate(IssueReceipt.templatePath, new IssueReceipt(claim).data())
        .on('response', (response: http.IncomingMessage) => {
          if (response.statusCode !== 200) {
            return next(new Error('Unexpected error during PDF generation'))
          }
          const buffers: Buffer[] = []
          response.on('data', (chunk: Buffer) => {
            buffers.push(chunk)
          })
          response.on('end', () => {
            const pdf = Buffer.concat(buffers)
            res.writeHead(HttpStatus.OK, {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename=moneyclaim-issue-receipt.pdf',
              'Content-Length': pdf.length
            })

            res.end(pdf)
          })
        })
        .on('error', (err: Error) => {
          next(err)
        })
    } catch (err) {
      next(err)
    }
  })
