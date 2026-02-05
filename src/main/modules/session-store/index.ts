import * as config from 'config'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

const useRedisStore = config.get<boolean>('session.useRedisStore')
const redisConfig = config.get<{
  host?: string
  port?: number
  key?: string
  tls?: boolean
  keyPrefix?: string
}>('session.redis')

// Log config for debugging (key value is never logged)
logger.info('session-store config', {
  useRedisStore,
  redisConfig: redisConfig ? {
    host: redisConfig.host,
    port: redisConfig.port,
    key: redisConfig.key ? '[REDACTED]' : undefined,
    tls: redisConfig.tls,
    keyPrefix: redisConfig.keyPrefix
  } : undefined
})

export interface SessionStoreOptions {
  useRedisStore?: boolean
  redis?: {
    host?: string
    port?: number
    key?: string
    tls?: boolean
    keyPrefix?: string
  }
  draftStoreAccessKey?: string
  maxAgeInMinutes?: number
  /** For testing: inject Redis client constructor and RedisStore constructor to avoid real connection */
  _redisFactory?: (connectionString: string, opts?: object) => { on: (event: string, fn: (err: Error) => void) => void }
  _redisStoreFactory?: (opts: { client: any; prefix: string; ttl: number }) => session.Store
}

function getRedisConnectionString (redis: typeof redisConfig, draftStoreAccessKey: string): string {
  if (redis?.host != null && redis?.port != null) {
    const protocol = redis.tls ? 'rediss://' : 'redis://'
    const auth = redis.key ? `${redis.key}@` : `${draftStoreAccessKey}@`
    return `${protocol}${auth}${redis.host}:${redis.port}`
  }
  return ''
}

export function getSessionStore (options?: SessionStoreOptions): session.Store {
  const useRedis = options?.useRedisStore ?? useRedisStore
  const redis = options?.redis ?? redisConfig
  const draftStoreAccessKey = options?.draftStoreAccessKey ?? config.get<string>('secrets.cmc.draft-store-access-key')
  const maxAgeInMinutes = options?.maxAgeInMinutes ?? config.get<number>('session.maxAgeInMinutes')

  if (useRedis) {
    const connectionString = getRedisConnectionString(redis, draftStoreAccessKey)
    logger.info('connectionString', { connectionString })
    if (!connectionString) {
      logger.error('SESSION_USE_REDIS_STORE is true but Redis is not configured. Set SESSION_REDIS_HOST and SESSION_REDIS_PORT (and SESSION_REDIS_KEY from Key Vault), or set SESSION_USE_REDIS_STORE=false for in-memory store.')
      throw new Error('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    }
    const useTls = connectionString.startsWith('rediss://') || redis?.tls === true
    const client = options?._redisFactory
      ? options._redisFactory(connectionString, { maxRetriesPerRequest: undefined, enableReadyCheck: true, tls: useTls ? { rejectUnauthorized: true } : undefined })
      : new Redis(connectionString, {
          maxRetriesPerRequest: undefined,
          enableReadyCheck: true,
          tls: useTls ? { rejectUnauthorized: true } : undefined
        })
    client.on('error', (err: Error) => logger.error('Redis session store error:', err))
    const store = options?._redisStoreFactory
      ? options._redisStoreFactory({ client: client as any, prefix: redis?.keyPrefix || 'sess:', ttl: maxAgeInMinutes * 60 })
      : new RedisStore({
          client: client as any,
          prefix: redis?.keyPrefix || 'sess:',
          ttl: maxAgeInMinutes * 60
        })
    logger.info('Session store: Redis')
    return store
  }
  logger.info('Session store: Memory (useRedisStore false)')
  return new session.MemoryStore()
}
