import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const apiServiceBaseURL: string = config.get<string>('idam.api.url')
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url')

const defaultServiceAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MDY5ODMyNjQsImp0aSI6IjM1NWUyNmRkLTE3NmQtNDkzMC1iMWY5LWMwYTM3Yjg2ZTk5OSIsImlhdCI6MTUwNjk3OTY2NH0.ODF45-4YrD8-nuX9IbWroQVHGcC-YnrGxLf62ONRTOU' // valid until 1st Jan 2100

export function resolveRetrieveUserFor (id: number, ...roles: string[]) {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles })
}

export function rejectRetrieveUserFor (reason: string) {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.FORBIDDEN, reason)
}

export function resolveRetrieveServiceToken (token: string = defaultServiceAuthToken) {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.OK, token)
}

export function rejectRetrieveServiceToken (reason: string = 'HTTP error') {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
