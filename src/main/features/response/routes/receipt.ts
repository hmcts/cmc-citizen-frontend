import * as express from 'express'
import * as http from 'http'
import * as HttpStatus from 'http-status-codes'

import { Paths } from 'response/paths'

import PdfClient from 'app/pdf/pdfClient'
import { ResponseReceipt } from 'app/pdf/responseReceipt'

import { buildURL } from 'app/utils/callbackBuilder'
import { ErrorHandling } from 'common/errorHandling'

export default express.Router()
  .get(Paths.receiptReceiver.uri, ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    new PdfClient().generate(ResponseReceipt.templatePath, new ResponseReceipt(res.locals.user.claim, buildURL(req, 'dashboard')).data())
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
