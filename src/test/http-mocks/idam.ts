import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const apiServiceBaseURL: string = config.get<string>('idam.api.url')
const s2sAuthServiceBaseURL = config.get<string>('idam.service-2-service-auth.url')

const defaultServiceAuthToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpZGFtIiwiaWF0IjoxNDgzMjI4ODAwLCJleHAiOjQxMDI0NDQ4MDAsImF1ZCI6ImNtYyIsInN1YiI6ImNtYyJ9.Q9-gf315saUt007Gau0tBUxevcRwhEckLHzC82EVGIM' // valid until 1st Jan 2100

export function resolveRetrieveUserFor (id: string, ...roles: string[]) {
  return mock(apiServiceBaseURL)
    .get('/details')
    .reply(HttpStatus.OK, { id: id, roles: roles, email: 'user@example.com' })
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
