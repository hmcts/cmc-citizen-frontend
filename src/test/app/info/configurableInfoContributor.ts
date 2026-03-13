/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'
import * as nock from 'nock'
import { InfoContributor } from '@hmcts/info-provider'

import { ConfigurableInfoContributor } from 'routes/configurableInfoContributor'

chai.use(spies)
const expect = chai.expect

describe('ConfigurableInfoContributor', () => {
  const serviceUrl = 'http://localhost/info'

  afterEach(() => {
    sinon.restore()
    nock.cleanAll()
  })

  it('should delegate to the base InfoContributor when no request options are provided', async () => {
    const contributor = new ConfigurableInfoContributor(serviceUrl)
    const superCall = sinon.stub(InfoContributor.prototype, 'call').resolves({ ok: true })

    const result = await contributor.call()

    expect(superCall).to.have.been.calledOnceWithExactly()
    expect(result).to.deep.equal({ ok: true })
  })

  it('should invoke request with the provided request options', async () => {
    const requestOptions = { headers: { 'X-Test': '1' } }
    const expectedResponse = { healthy: true }
    nock('http://localhost')
      .get('/info')
      .matchHeader('X-Test', '1')
      .reply(200, expectedResponse)

    const contributor = new ConfigurableInfoContributor(serviceUrl, requestOptions)
    const result = await contributor.call()

    expect(result).to.deep.equal(expectedResponse)
    expect(nock.isDone()).to.be.true
  })

  it('should return a structured error payload when the upstream call fails', async () => {
    nock('http://localhost')
      .get('/info')
      .reply(500, { message: 'bad' })

    const contributor = new ConfigurableInfoContributor(serviceUrl, {})
    const result = await contributor.call()

    expect(result).to.deep.equal({
      error: `Error calling ${serviceUrl}`,
      statusText: 'Request failed with status 500',
      body: { message: 'bad' }
    })
    expect(nock.isDone()).to.be.true
  })
})
