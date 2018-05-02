/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import * as jwt from 'jsonwebtoken'
import * as moment from 'moment'

import { ServiceAuthToken } from 'idam/serviceAuthToken'

describe('ServiceAuthToken', () => {
  describe('hasExpired', () => {
    it('should thrown an error when token is malformed', () => {
      expect(() => new ServiceAuthToken('malformed-jwt-token').hasExpired()).to.throw(Error, 'Unable to parse JWT token: malformed-jwt-token')
    })

    it('should return true when token has expired', () => {
      const token = jwt.sign({ exp: moment().unix() }, 'secret')
      expect(new ServiceAuthToken(token).hasExpired()).to.be.true
    })

    it('should return false when token has not expired yet', () => {
      const token = jwt.sign({ exp: moment().add(1, 'second').unix() }, 'secret')
      expect(new ServiceAuthToken(token).hasExpired()).to.be.false
    })
  })
})
