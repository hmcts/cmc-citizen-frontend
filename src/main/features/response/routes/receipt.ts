import * as express from 'express'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'response/paths'

import PdfClient from 'app/pdf/pdfClient'
import { ResponseReceipt } from 'app/pdf/responseReceipt'

import ClaimStoreClient from 'claims/claimStoreClient'
import Claim from 'claims/models/claim'
import { DefendantResponse } from 'claims/models/defendantResponse'
import { buildURL } from 'app/utils/CallbackBuilder'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(Paths.receiptReceiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { externalId } = req.params
    const claim: Claim = await ClaimStoreClient.retrieveByExternalId(externalId)
    const response: DefendantResponse = await ClaimStoreClient.retrieveResponse(res.locals.user.id, claim.id)
    new PdfClient().generate(ResponseReceipt.templatePath, new ResponseReceipt(claim, response, buildURL(req, 'dashboard')).data())
      .on('response', (response: http.IncomingMessage) => {
        if (response.statusCode !== 200) {
          next(new Error('Unexpected error during PDF generation'))
        }
        const buffers: Buffer[] = []
        response.on('data', (chunk: Buffer) => {
          buffers.push(chunk)
        })
        response.on('end', () => {
          const pdf = Buffer.concat(buffers)
          res.writeHead(HttpStatus.OK, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=moneyclaim-response-receipt.pdf',
            'Content-Length': pdf.length
          })

          res.end(pdf)
        })
      })
      .on('error', (err: Error) => {
        next(err)
      })
  }))
