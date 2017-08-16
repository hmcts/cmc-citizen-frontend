import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = `${config.get('pdf-service.url')}/api/${config.get('pdf-service.apiVersion')}`

export function resolveGenerate () {
  mock(serviceBaseURL)
    .post('/pdf-generator/html')
    .reply(HttpStatus.OK, [])
}

export function rejectGenerate (reason: string) {
  mock(serviceBaseURL)
    .post('/pdf-generator/html')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
