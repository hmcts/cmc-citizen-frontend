import * as config from 'config'
import * as fs from 'fs'
import * as http from 'http'
import { requestNonPromise } from 'client/request'

const pdfServiceBaseUrl = config.get<string>('pdf-service.url')
const pdfServiceVersion = config.get<string>('pdf-service.apiVersion')

export default class PdfClient {

  constructor (public pdfUrl: string = `${pdfServiceBaseUrl}/api/${pdfServiceVersion}/pdf-generator/html`) {
    this.pdfUrl = pdfUrl
  }

  generate (templatePath: string, data: object): http.IncomingMessage {
    return requestNonPromise.post({
      uri: this.pdfUrl,
      formData: {
        template: fs.createReadStream(templatePath),
        placeholderValues: JSON.stringify(data)
      }
    })
  }
}
