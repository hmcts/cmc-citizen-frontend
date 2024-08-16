import { OAuthHelper } from 'idam/oAuthHelper'
import { Request } from 'express'
import * as sinon from 'sinon'
import { mockRes as res } from 'sinon-express-mock'
import * as Cookies from 'cookies'
import { expect } from 'chai'
import * as config from 'config'
import { Base64 } from 'js-base64'
import { beforeEach } from 'mocha'
import * as uuid from 'uuid'

function extractStateValue (inputString: string): string {
  const match = inputString.match(/state=([^\s&]+)/)
  return match ? match[1] : ''
}

describe('oAuthHelper', () => {
  describe('forLogin', () => {
    const defaultLoginPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/o/authorize\\?response_type=code&state=(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?&client_id=cmc_citizen&redirect_uri=https://localhost:[0-9]{1,5}/receiver&scope=openid profile roles`)

    beforeEach(() => {
      sinon.stub(Cookies.prototype, 'set')
    })

    afterEach(() => {
      Cookies.prototype.set.restore()
    })

    it('should return login Idam page', () => {
      const req = {
        headers: {
          host: 'localhost:3000'
        },
        originalUrl: ''
      } as Request
      const loginUrl = OAuthHelper.forLogin(req, res)
      expect(loginUrl).to.match(defaultLoginPagePattern)
    })

    it('should return login Idam page with redirectToClaim to claimant claims detail', () => {
      const redirectToClaim = `/dashboard/${uuid()}/claimant`
      const req = {
        headers: {
          host: 'localhost:3000'
        },
        originalUrl: redirectToClaim
      } as Request
      const loginUrl = OAuthHelper.forLogin(req, res)
      const state = extractStateValue(loginUrl)
      const results = JSON.parse(Base64.decode(state))['redirectToClaim']
      expect(results).to.equal(redirectToClaim)
    })

    it('should return login Idam page with redirectToClaim to defendant claims detail', () => {
      const redirectToClaim = `/dashboard/${uuid()}/defendant`
      const req = {
        headers: {
          host: 'localhost:3000'
        },
        originalUrl: redirectToClaim
      } as Request
      const loginUrl = OAuthHelper.forLogin(req, res)
      const state = extractStateValue(loginUrl)
      const results = JSON.parse(Base64.decode(state))['redirectToClaim']
      expect(results).to.equal(redirectToClaim)
    })

    it('should return login Idam page without redirectToClaim to claims detail if it doesnt match the expect url', () => {
      const redirectToClaim = '/dashboard/12345678906/defendant'
      const req = {
        headers: {
          host: 'localhost:3000'
        },
        originalUrl: redirectToClaim
      } as Request
      const loginUrl = OAuthHelper.forLogin(req, res)
      const state = extractStateValue(loginUrl)
      const results = JSON.parse(Base64.decode(state))['redirectToClaim']
      expect(results).to.equal(undefined)
    })
  })
})
