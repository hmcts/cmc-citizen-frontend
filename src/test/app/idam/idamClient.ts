import { expect } from 'chai'
import * as sinon from 'sinon'
import { OTP } from 'otp'
import { request } from 'client/httpClient'
import { IdamClient } from 'idam/idamClient'

describe('IdamClient service authentication', () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('should send a resolved six-digit password when requesting a service token', async () => {
    const post = sandbox.stub(request, 'post').resolves('service-token')

    const token = await IdamClient.retrieveServiceToken()

    expect(post.calledOnce).to.equal(true)
    const options = post.firstCall.args[0]
    expect(options.uri).to.match(/\/lease$/)
    expect(options.body.oneTimePassword).to.match(/^\d{6}$/)
    expect(token.bearerToken).to.equal('service-token')
  })

  it('should generate the expected SHA-1 TOTP from the RFC 6238 test vector', async () => {
    // Public test key: ASCII "12345678901234567890", encoded as Base32.
    const otp = new OTP({ secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', codeLength: 8 })

    expect(await otp.totp(59000)).to.equal('94287082')
  })
})
