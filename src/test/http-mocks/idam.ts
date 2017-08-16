import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'
import ServiceAuthToken from 'idam/serviceAuthToken'

const apiServiceBaseURL: string = config.get<string>('idam.api.url')
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url')

export function resolveRetrieveUserFor (id: number, ...roles: string[]) {
  mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles })
}

export function rejectRetrieveUserFor (reason: string) {
  mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason)
}

export function resolveRetrieveServiceToken (token: string) {
  mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.OK, new ServiceAuthToken(token))
}

export function rejectRetrieveServiceToken (reason: string = 'HTTP error') {
  mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
