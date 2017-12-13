import * as config from 'config'
import * as fs from 'fs'
import { requestNonPromise } from 'client/request'
import { Request } from 'request'

const pdfServiceBaseUrl = config.get<string>('pdf-service.url')
const pdfServiceVersion = config.get<string>('pdf-service.apiVersion')

export class PdfClient {

  constructor (public pdfUrl: string = `${pdfServiceBaseUrl}/api/${pdfServiceVersion}/pdf-generator/html`) {
    this.pdfUrl = pdfUrl
  }

  generate (templatePath: string, data: object): Request {
    return requestNonPromise.post({
      uri: this.pdfUrl,
      formData: {
        template: fs.createReadStream(templatePath),
        placeholderValues: JSON.stringify(data)
      }
    })
  }
}
