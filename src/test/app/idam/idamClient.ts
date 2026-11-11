import { expect } from 'chai'
import * as sinon from 'sinon'
import * as config from 'config'
import * as nock from 'nock'
import { OTP } from 'otp'
import { IdamClient } from 'idam/idamClient'

describe('IdamClient service authentication', () => {
  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('should send a resolved six-digit password when requesting a service token', async () => {
    sinon.stub(Date, 'now').returns(59000)
    const lease = nock(config.get<string>('idam.service-2-service-auth.url'))
      .post('/lease', body => typeof body.oneTimePassword === 'string' && /^\d{6}$/.test(body.oneTimePassword))
      .reply(200, 'service-token')

    const token = await IdamClient.retrieveServiceToken()

    expect(lease.isDone()).to.equal(true)
    expect(token.bearerToken).to.equal('service-token')
  })

  it('should generate the expected SHA-1 TOTP from the RFC 6238 test vector', async () => {
    // Public test key: ASCII "12345678901234567890", encoded as Base32.
    const otp = new OTP({ secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', codeLength: 8 })

    expect(await otp.totp(59000)).to.equal('94287082')
  })
})
