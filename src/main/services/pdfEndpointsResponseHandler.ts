import * as express from 'express'
import * as HttpStatus from 'http-status-codes'
import * as http from 'http'

export function pdfEndpointResponseHandler (filename: string, res: express.Response): (response: http.IncomingMessage) => void {

  return function (response: http.IncomingMessage): void {
    if (response.statusCode !== HttpStatus.OK) {
      throw new Error(response.statusMessage || 'Unexpected error during document retrieval')
    }

    const buffers: Buffer[] = []
    response.on('data', (chunk: Buffer) => {
      buffers.push(chunk)
    })
    response.on('end', () => {
      const pdf = Buffer.concat(buffers)
      res.writeHead(HttpStatus.OK, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${filename}.pdf`,
        'Content-Length': pdf.length
      })

      res.end(pdf)
    })
  }
}
