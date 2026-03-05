import { expect } from 'chai'
import * as sinon from 'sinon'
import { IdamClient } from 'idam/idamClient'
import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

describe('ServiceAuthTokenFactoryImpl', () => {
  let retrieveServiceTokenStub: sinon.SinonStub

  beforeEach(() => {
    retrieveServiceTokenStub = sinon.stub(IdamClient, 'retrieveServiceToken')
  })

  afterEach(() => {
    retrieveServiceTokenStub.restore()
  })

  it('should retrieve a new token if one does not exist', async () => {
    const token = new ServiceAuthToken('new-token')
    sinon.stub(token, 'hasExpired').returns(false)
    retrieveServiceTokenStub.resolves(token)

    const factory = new ServiceAuthTokenFactoryImpl()
    const result = await factory.get()

    expect(result.bearerToken).to.equal(token.bearerToken)
    expect(retrieveServiceTokenStub.calledOnce).to.be.true
  })

  it('should return the cached token if it has not expired', async () => {
    const token = new ServiceAuthToken('cached-token')
    sinon.stub(token, 'hasExpired').returns(false)
    retrieveServiceTokenStub.resolves(token)

    const factory = new ServiceAuthTokenFactoryImpl()
    // First call to populate the cache
    await factory.get()

    // Second call should use cache
    const result = await factory.get()

    expect(result.bearerToken).to.equal(token.bearerToken)
    expect(retrieveServiceTokenStub.calledOnce).to.be.true
  })

  it('should retrieve a new token if the cached one has expired', async () => {
    const expiredToken = new ServiceAuthToken('expired-token')
    sinon.stub(expiredToken, 'hasExpired').returns(true)

    const newToken = new ServiceAuthToken('new-token')
    sinon.stub(newToken, 'hasExpired').returns(false)

    retrieveServiceTokenStub.onFirstCall().resolves(expiredToken)
    retrieveServiceTokenStub.onSecondCall().resolves(newToken)

    const factory = new ServiceAuthTokenFactoryImpl()

    // First call to populate the cache with expired token
    await factory.get()

    // Second call should see expired token and fetch a new one
    const result = await factory.get()

    expect(result.bearerToken).to.equal(newToken.bearerToken)
    expect(retrieveServiceTokenStub.calledTwice).to.be.true
  })
})
