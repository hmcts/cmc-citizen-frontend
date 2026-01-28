import { expect } from 'chai'
import { Request } from 'express'

import { JwtExtractor } from 'idam/jwtExtractor'

describe('Extracting JWT', () => {
  it('should return token from session (not from cookie)', () => {
    const jwtValue = 'a'

    const req = {
      session: {
        user: {
          bearerToken: jwtValue
        }
      }
    } as Request

    expect(JwtExtractor.extract(req)).to.equal(jwtValue)
  })

  it('should return undefined when session has no user', () => {
    const req = { session: {} } as Request
    expect(JwtExtractor.extract(req)).to.be.undefined
  })

  it('should return undefined when session is missing', () => {
    const req = {} as Request
    expect(JwtExtractor.extract(req)).to.be.undefined
  })
})
