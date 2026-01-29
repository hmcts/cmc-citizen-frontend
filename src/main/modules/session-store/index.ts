import * as config from 'config'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

const useRedisStore = config.get<boolean>('session.useRedisStore')
const redisConfig = config.get<{ url?: string; keyPrefix?: string }>('session.redis')

/**
 * Returns a session store: Redis when session.useRedisStore is true (REDISCLOUD_URL required),
 * otherwise in-memory when useRedisStore is false (e.g. tests).
 * JWTs are stored server-side; only the session ID is sent in the cookie (Secure, HttpOnly, SameSite=Strict).
 */
export function getSessionStore (): session.Store {
  if (useRedisStore) {
    if (!redisConfig?.url) {
      logger.error('SESSION_USE_REDIS_STORE is true but REDISCLOUD_URL is not set. Set REDISCLOUD_URL or set SESSION_USE_REDIS_STORE=false for in-memory store.')
      throw new Error('REDISCLOUD_URL is required when session.useRedisStore is true')
    }
    const client = new Redis(redisConfig.url, {
      maxRetriesPerRequest: undefined,
      enableReadyCheck: true,
      tls: redisConfig.url.startsWith('rediss://') ? { rejectUnauthorized: true } : undefined
    })
    client.on('error', (err: Error) => logger.error('Redis session store error:', err))
    const store = new RedisStore({
      client: client as any,
      prefix: redisConfig.keyPrefix || 'sess:',
      ttl: config.get<number>('session.maxAgeInMinutes') * 60
    })
    logger.info('Session store: Redis')
    return store
  }
  logger.info('Session store: Memory (useRedisStore false)')
  return new session.MemoryStore()
}
