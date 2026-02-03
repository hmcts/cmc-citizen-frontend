import { expect } from 'chai'

describe('session-store', () => {
  describe('getSessionStore', () => {
    it('returns MemoryStore when session.useRedisStore is false', () => {
      const { getSessionStore } = require('modules/session-store')
      const store = getSessionStore()
      expect(store).to.not.be.undefined
      expect(store.constructor.name).to.equal('MemoryStore')
    })

    it('returns a store with get, set, destroy methods (session store interface)', () => {
      const { getSessionStore } = require('modules/session-store')
      const store = getSessionStore()
      expect(store.get).to.be.a('function')
      expect(store.set).to.be.a('function')
      expect(store.destroy).to.be.a('function')
    })
  })
})
