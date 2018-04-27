import { expect } from 'chai'
import { mockReq as req } from 'sinon-express-mock'
import { buildURL } from 'utils/callbackBuilder'

describe('CallbackBuilder', () => {

  describe(`buildURL should create URL `, () => {
    it('for SSL request ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = true
      req.headers = { host: 'localhost' }
      let url = buildURL(req, path)

      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })

    it('for non SSL request ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = false
      req.headers = { host: 'localhost' }

      let url = buildURL(req, path)
      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })
  })

  describe(`buildURL should throw error `, () => {
    it('for undefined request ', () => {
      const path = 'my/service/path'
      expect(() => buildURL(undefined, path)).to.throw(Error, 'Request is undefined')
    })

    it('for null path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => buildURL(req, null)).to.throw(Error, 'Path null or undefined')
    })

    it('for empty path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => buildURL(req, '')).to.throw(Error, 'Path null or undefined')
    })

    it('for undefined path ', () => {
      req.secure = false
      req.headers = { host: 'localhost' }
      expect(() => buildURL(req, undefined)).to.throw(Error, 'Path null or undefined')
    })
  })

})
