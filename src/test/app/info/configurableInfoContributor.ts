/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import * as requestPromise from 'request-promise-native'
import { InfoContributor } from '@hmcts/info-provider'

import { ConfigurableInfoContributor } from 'routes/info'

chai.use(spies)
const expect = chai.expect

describe('ConfigurableInfoContributor', () => {
  const serviceUrl = 'http://localhost/info'

  afterEach(() => {
    sinon.restore()
  })

  it('should delegate to the base InfoContributor when no request options are provided', async () => {
    const contributor = new ConfigurableInfoContributor(serviceUrl)
    const superCall = sinon.stub(InfoContributor.prototype, 'call').resolves({ ok: true })

    const result = await contributor.call()

    expect(superCall).to.have.been.calledOnceWithExactly()
    expect(result).to.deep.equal({ ok: true })
  })

  it('should invoke request-promise with the provided request options', async () => {
    const requestOptions = { strictSSL: false, headers: { 'X-Test': '1' } }
    const contributor = new ConfigurableInfoContributor(serviceUrl, requestOptions)
    const superCall = sinon.stub(InfoContributor.prototype, 'call')
    const expectedResponse = { healthy: true }
    const getStub = sinon.stub(requestPromise, 'get').resolves(expectedResponse)

    const result = await contributor.call()

    expect(result).to.equal(expectedResponse)
    expect(getStub).to.have.been.calledOnceWithExactly({
      uri: serviceUrl,
      json: true,
      ...requestOptions
    })
    expect(superCall).not.to.have.been.called
  })

  it('should return a structured error payload when the upstream call fails', async () => {
    const contributor = new ConfigurableInfoContributor(serviceUrl, { strictSSL: false })
    const error: any = new Error('Service unavailable')
    error.response = { body: { message: 'bad' } }
    sinon.stub(requestPromise, 'get').rejects(error)

    const result = await contributor.call()

    expect(result).to.deep.equal({
      error: `Error calling ${serviceUrl}`,
      statusText: 'Service unavailable',
      body: { message: 'bad' }
    })
  })
})
