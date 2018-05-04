import * as express from 'express'
import * as HttpStatus from 'http-status-codes'

export class DownloadUtils {

  static downloadPDF (res: express.Response, content: Buffer, filename: string) {
    res.writeHead(HttpStatus.OK, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}.pdf`,
      'Content-Length': content ? content.length : 0
    })
    res.end(content)
  }
}
