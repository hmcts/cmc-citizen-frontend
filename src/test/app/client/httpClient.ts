import { expect } from 'chai'
import * as nock from 'nock'
import { request, noRetryRequest } from 'client/httpClient'

const mockServer = 'http://localhost:9999'

describe('httpClient', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  describe('GET requests', () => {
    it('should return response data by default', async () => {
      nock(mockServer).get('/test').reply(200, { ok: true })
      const result = await request.get({ uri: `${mockServer}/test` })
      expect(result).to.deep.equal({ ok: true })
    })

    it('should accept a string URI', async () => {
      nock(mockServer).get('/str').reply(200, { str: true })
      const result = await request.get(`${mockServer}/str`)
      expect(result).to.deep.equal({ str: true })
    })

    it('should return full response when resolveWithFullResponse is true', async () => {
      nock(mockServer).get('/full').reply(200, { data: 1 })
      const result = await request.get({ uri: `${mockServer}/full`, resolveWithFullResponse: true })
      expect(result.statusCode).to.equal(200)
      expect(result.body).to.deep.equal({ data: 1 })
      expect(result.headers).to.exist
    })

    it('should return full response when fullResponse is true', async () => {
      nock(mockServer).get('/full2').reply(200, { data: 2 })
      const result = await request.get({ uri: `${mockServer}/full2`, fullResponse: true })
      expect(result.statusCode).to.equal(200)
      expect(result.body).to.deep.equal({ data: 2 })
    })

    it('should throw on 4xx when simple is not false', async () => {
      nock(mockServer).get('/err').reply(400, { error: 'bad' })
      try {
        await request.get({ uri: `${mockServer}/err` })
        expect.fail('should have thrown')
      } catch (err) {
        expect(err.statusCode).to.equal(400)
        expect(err.body).to.deep.equal({ error: 'bad' })
        expect(err.error).to.deep.equal({ error: 'bad' })
      }
    })

    it('should not throw on 4xx when simple is false', async () => {
      nock(mockServer).get('/ok4xx').reply(400, { error: 'bad' })
      const result = await request.get({ uri: `${mockServer}/ok4xx`, simple: false, resolveWithFullResponse: true })
      expect(result.statusCode).to.equal(400)
    })

    it('should pass query string params via qs option', async () => {
      nock(mockServer).get('/qs').query({ foo: 'bar' }).reply(200, 'ok')
      const result = await request.get({ uri: `${mockServer}/qs`, qs: { foo: 'bar' } })
      expect(result).to.equal('ok')
    })
  })

  describe('POST requests', () => {
    it('should send JSON body', async () => {
      nock(mockServer).post('/post', { key: 'val' }).reply(201, { created: true })
      const result = await request.post({ uri: `${mockServer}/post`, body: { key: 'val' }, simple: false, resolveWithFullResponse: true })
      expect(result.statusCode).to.equal(201)
      expect(result.body).to.deep.equal({ created: true })
    })

    it('should send form data', async () => {
      nock(mockServer).post('/form').reply(200, 'form-ok')
      const result = await request.post({ uri: `${mockServer}/form`, form: { field: 'value' } })
      expect(result).to.equal('form-ok')
    })

    it('should not set body content-type when json is false', async () => {
      nock(mockServer).post('/raw').reply(200, 'raw-ok')
      const result = await request.post({ uri: `${mockServer}/raw`, body: 'rawdata', json: false })
      expect(result).to.equal('raw-ok')
    })
  })

  describe('PUT requests', () => {
    it('should send PUT request', async () => {
      nock(mockServer).put('/put').reply(200, { updated: true })
      const result = await request.put({ uri: `${mockServer}/put`, body: { data: 1 } })
      expect(result).to.deep.equal({ updated: true })
    })
  })

  describe('PATCH requests', () => {
    it('should send PATCH request', async () => {
      nock(mockServer).patch('/patch').reply(200, { patched: true })
      const result = await request.patch({ uri: `${mockServer}/patch`, body: { data: 1 } })
      expect(result).to.deep.equal({ patched: true })
    })
  })

  describe('DELETE requests', () => {
    it('should send DELETE via del()', async () => {
      nock(mockServer).delete('/del').reply(204, '')
      const result = await request.del({ uri: `${mockServer}/del`, simple: false })
      expect(result).to.equal('')
    })

    it('should send DELETE via delete()', async () => {
      nock(mockServer).delete('/delete').reply(204, '')
      const result = await request.delete({ uri: `${mockServer}/delete`, simple: false })
      expect(result).to.equal('')
    })
  })

  describe('HEAD requests', () => {
    it('should send HEAD request', async () => {
      nock(mockServer).head('/head').reply(200)
      const result = await request.head({ uri: `${mockServer}/head`, simple: false })
      expect(result).to.equal('')
    })
  })

  describe('callable interface', () => {
    it('should work as a function with method option', async () => {
      nock(mockServer).get('/callable').reply(200, { callable: true })
      const result = await request({ uri: `${mockServer}/callable`, method: 'GET' })
      expect(result).to.deep.equal({ callable: true })
    })

    it('should default to GET when no method specified', async () => {
      nock(mockServer).get('/default').reply(200, { defaultGet: true })
      const result = await request({ uri: `${mockServer}/default` })
      expect(result).to.deep.equal({ defaultGet: true })
    })

    it('should handle DELETE method via callable', async () => {
      nock(mockServer).delete('/call-del').reply(200, 'deleted')
      const result = await request({ uri: `${mockServer}/call-del`, method: 'DELETE', simple: false })
      expect(result).to.equal('deleted')
    })
  })

  describe('defaults', () => {
    it('should create a new client with merged options', async () => {
      nock(mockServer).get('/defaults').reply(200, { ok: true })
      const client = request.defaults({ resolveWithFullResponse: true })
      const result = await client.get({ uri: `${mockServer}/defaults` })
      expect(result.statusCode).to.equal(200)
      expect(result.body).to.deep.equal({ ok: true })
    })
  })

  describe('toAxiosConfig edge cases', () => {
    it('should throw when no uri or url is provided', async () => {
      try {
        await request.get({} as any)
        expect.fail('should have thrown')
      } catch (err) {
        expect(err.message).to.equal('uri or url is required')
      }
    })

    it('should accept url instead of uri', async () => {
      nock(mockServer).get('/url-opt').reply(200, 'url-ok')
      const result = await request.get({ url: `${mockServer}/url-opt` })
      expect(result).to.equal('url-ok')
    })

    it('should handle auth option', async () => {
      nock(mockServer).get('/auth').reply(200, 'auth-ok')
      const result = await request.get({ uri: `${mockServer}/auth`, auth: { username: 'user', password: 'pass' } })
      expect(result).to.equal('auth-ok')
    })

    it('should handle encoding null for arraybuffer', async () => {
      nock(mockServer).get('/bin').reply(200, 'binary')
      const result = await request.get({ uri: `${mockServer}/bin`, encoding: null })
      expect(result).to.exist
    })
  })

  describe('noRetryRequest', () => {
    it('should work without retries', async () => {
      nock(mockServer).get('/noretry').reply(200, { no: 'retry' })
      const result = await noRetryRequest.get({ uri: `${mockServer}/noretry` })
      expect(result).to.deep.equal({ no: 'retry' })
    })
  })

  describe('normalizeOptions', () => {
    it('should handle two-argument form with string and options', async () => {
      nock(mockServer).get('/two-arg').reply(200, 'two-arg-ok')
      const result = await request.get(`${mockServer}/two-arg`, {} as any)
      expect(result).to.equal('two-arg-ok')
    })
  })
})
