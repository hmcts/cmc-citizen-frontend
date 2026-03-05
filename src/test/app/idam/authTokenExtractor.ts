import { expect } from 'chai'
import { Request } from 'express'

import { AuthTokenExtractor } from 'idam/authTokenExtractor'

describe('AuthTokenExtractor', () => {
  it('should return token from session', () => {
    const tokenValue = 'a'

    const req = {
      session: {
        authenticationToken: tokenValue
      }
    } as Request

    expect(AuthTokenExtractor.extract(req)).to.equal(tokenValue)
  })

  it('should return undefined when session is undefined', () => {
    const req = {
      session: undefined
    } as Request

    expect(AuthTokenExtractor.extract(req)).to.equal(undefined)
  })

  it('should return undefined when session has no authenticationToken', () => {
    const req = {
      session: {}
    } as Request

    expect(AuthTokenExtractor.extract(req)).to.equal(undefined)
  })
})
