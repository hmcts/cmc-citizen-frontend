import { expect } from 'chai'
import { Request } from 'express'

import { JwtExtractor } from 'idam/jwtExtractor'

describe('Extracting JWT', () => {
  it('should return token from session', () => {
    const jwtValue = 'a'

    const req = {
      session: {
        user: { bearerToken: jwtValue }
      }
    } as unknown as Request

    expect(JwtExtractor.extract(req)).to.equal(jwtValue)
  })

  it('should return undefined when no session user', () => {
    const req = { session: {} } as unknown as Request
    expect(JwtExtractor.extract(req)).to.be.undefined
  })

  it('should return undefined when no session', () => {
    const req = {} as Request
    expect(JwtExtractor.extract(req)).to.be.undefined
  })
})
