import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { getSessionStore } from 'modules/session-store'
import type { SessionStoreOptions } from 'modules/session-store'

chai.use(sinonChai)
const { expect } = chai

const mockRedisClient = {
  on: sinon.stub().returnsThis()
}

const mockStore = {
  get: sinon.stub(),
  set: sinon.stub(),
  destroy: sinon.stub()
}

let lastConnectionString: string
let lastStoreOpts: { prefix: string; ttl: number }

function redisPathOptions (overrides: Partial<SessionStoreOptions>): SessionStoreOptions {
  return {
    useRedisStore: true,
    redis: { host: 'localhost', port: 6379, key: 'k', tls: false, keyPrefix: 'sess:' },
    draftStoreAccessKey: 'default-key',
    maxAgeInMinutes: 120,
    _redisFactory: (connectionString: string) => {
      lastConnectionString = connectionString
      return mockRedisClient as any
    },
    _redisStoreFactory: (opts) => {
      lastStoreOpts = opts
      return mockStore as any
    },
    ...overrides
  }
}

describe('session-store', () => {
  describe('getSessionStore', () => {
    it('returns MemoryStore when session.useRedisStore is false', () => {
      const store = getSessionStore()
      expect(store).to.not.be.undefined
      expect(store.constructor.name).to.equal('MemoryStore')
    })

    it('returns a store with get, set, destroy methods (session store interface)', () => {
      const store = getSessionStore()
      expect(store.get).to.be.a('function')
      expect(store.set).to.be.a('function')
      expect(store.destroy).to.be.a('function')
    })
  })

  describe('getSessionStore (Redis path)', () => {
    it('returns store when useRedisStore is true and redis is configured (auth from draftStoreAccessKey)', () => {
      const opts = redisPathOptions({
        redis: { host: 'redis.example.com', port: 6379, tls: false, keyPrefix: 'sess:' },
        draftStoreAccessKey: 'redis-key'
      })
      const store = getSessionStore(opts)

      expect(store).to.equal(mockStore)
      expect(lastConnectionString).to.include('redis://')
      expect(lastConnectionString).to.include('redis-key@')
      expect(lastConnectionString).to.include('redis.example.com:6379')
    })

    it('returns store when useRedisStore is true and auth from Key Vault (draftStoreAccessKey)', () => {
      const opts = redisPathOptions({
        redis: { host: 'redis.example.com', port: 6379, tls: false, keyPrefix: 'citizen:' },
        draftStoreAccessKey: 'key-vault-redis-key'
      })
      const store = getSessionStore(opts)

      expect(store).to.equal(mockStore)
      expect(lastConnectionString).to.include('key-vault-redis-key@')
    })

    it('uses rediss:// and TLS when session.redis.tls is true', () => {
      const opts = redisPathOptions({
        redis: { host: 'redis.secure.com', port: 6380, tls: true, keyPrefix: 'sess:' },
        draftStoreAccessKey: 'secret'
      })
      getSessionStore(opts)

      expect(lastConnectionString).to.match(/^rediss:\/\//)
    })

    it('uses default keyPrefix when session.redis.keyPrefix is not set', () => {
      const opts = redisPathOptions({ redis: { host: 'localhost', port: 6379 }, draftStoreAccessKey: 'k' })
      getSessionStore(opts)

      expect(lastStoreOpts.prefix).to.equal('sess:')
    })

    it('throws when useRedisStore is true but redis host/port are missing', () => {
      expect(() =>
        getSessionStore({
          useRedisStore: true,
          redis: { host: null as any, port: null as any },
          draftStoreAccessKey: 'k',
          maxAgeInMinutes: 120
        })
      ).to.throw('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    })

    it('throws when useRedisStore is true but session.redis is empty', () => {
      expect(() =>
        getSessionStore({
          useRedisStore: true,
          redis: {},
          draftStoreAccessKey: 'k',
          maxAgeInMinutes: 120
        })
      ).to.throw('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    })
  })
})
