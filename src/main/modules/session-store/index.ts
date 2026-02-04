import * as config from 'config'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

const useRedisStore = config.get<boolean>('session.useRedisStore')
const redisConfig = config.get<{
  url?: string
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
    url: redisConfig.url ? '[SET]' : undefined,
    host: redisConfig.host,
    port: redisConfig.port,
    key: redisConfig.key ? '[REDACTED]' : undefined,
    tls: redisConfig.tls,
    keyPrefix: redisConfig.keyPrefix
  } : undefined
})

function getRedisConnectionString (): string {
  if (redisConfig?.url) {
    return redisConfig.url
  }
  if (redisConfig?.host != null && redisConfig?.port != null) {
    const protocol = redisConfig.tls ? 'rediss://' : 'redis://'
    const auth = redisConfig.key ? `${redisConfig.key}@` : ''
    return `${protocol}${auth}${redisConfig.host}:${redisConfig.port}`
  }
  return ''
}

export function getSessionStore (): session.Store {

  if (useRedisStore) {
    const connectionString = getRedisConnectionString()
    logger.info('connectionString', { connectionString })
    if (!connectionString) {
      logger.error('SESSION_USE_REDIS_STORE is true but Redis is not configured. Set SESSION_REDIS_HOST and SESSION_REDIS_PORT (and SESSION_REDIS_KEY from Key Vault), or set SESSION_USE_REDIS_STORE=false for in-memory store.')
      throw new Error('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    }
    const useTls = connectionString.startsWith('rediss://') || redisConfig?.tls === true
    const client = new Redis(connectionString, {
      maxRetriesPerRequest: undefined,
      enableReadyCheck: true,
      tls: useTls ? { rejectUnauthorized: true } : undefined
    })
    client.on('error', (err: Error) => logger.error('Redis session store error:', err))
    const store = new RedisStore({
      client: client as any,
      prefix: redisConfig?.keyPrefix || 'sess:',
      ttl: config.get<number>('session.maxAgeInMinutes') * 60
    })
    logger.info('Session store: Redis')
    return store
  }
  logger.info('Session store: Memory (useRedisStore false)')
  return new session.MemoryStore()
}
