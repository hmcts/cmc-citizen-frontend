import * as config from 'config'
import { expect } from 'chai'

import JwtExtractor from 'app/idam/jwtExtractor'

const sessionCookieName = config.get<string>('session.cookieName')

describe('Extracting JWT', () => {
  it('should return token from query string', () => {
    const jwtValue = 'a'

    const req = {
      query: {
        jwt: jwtValue
      }
    }

    expect(JwtExtractor.extract(req)).to.equal(jwtValue)
  })

  it('should return token from cookie', () => {
    const jwtValue = 'a'

    const req = {
      cookies: {
        [sessionCookieName]: jwtValue
      }
    }

    expect(JwtExtractor.extract(req)).to.equal(jwtValue)
  })

  it('should return token from query string first', () => {
    const jwtValue = 'a'

    const req = {
      query: {
        jwt: jwtValue
      },
      cookies: {
        [sessionCookieName]: 'b'
      }
    }

    expect(JwtExtractor.extract(req)).to.equal(jwtValue)
  })

  it('should return undefined if no cookie', () => {
    const req = {}
    expect(JwtExtractor.extract(req)).to.equal(undefined)
  })
})
