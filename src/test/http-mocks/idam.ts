import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const apiServiceBaseURL: string = config.get<string>('idam.api.url')
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url')

export const defaultAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM' // valid until 1st Jan 2100

export function resolveRetrieveUserFor (id: string, ...roles: string[]) {
  return mock(apiServiceBaseURL)
    .get('/o/userinfo')
    .reply(HttpStatus.OK, { uid: id, roles: roles, sub: 'user@example.com' })
}

export function resolveExchangeCode (token: string) {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.OK, {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 28800
    })
}

export function rejectExchangeCode (token: string) {
  mock(apiServiceBaseURL)
    .post(new RegExp('/oauth2/token.*'))
    .reply(HttpStatus.UNAUTHORIZED)
}

export function resolveInvalidateSession (token: string) {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.OK)
}

export function rejectInvalidateSession (token: string = defaultAuthToken, reason = 'HTTP error') {
  mock(apiServiceBaseURL)
    .delete(`/session/${token}`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function rejectRetrieveUserFor (reason: string) {
  return mock(apiServiceBaseURL)
    .get('/o/userinfo')
    .reply(HttpStatus.FORBIDDEN, reason)
}

export function resolveRetrieveServiceToken (token: string = defaultAuthToken) {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.OK, token)
}

export function rejectRetrieveServiceToken (reason = 'HTTP error') {
  return mock(s2sAuthServiceBaseURL)
    .post('/lease')
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
