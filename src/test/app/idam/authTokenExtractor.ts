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
})
