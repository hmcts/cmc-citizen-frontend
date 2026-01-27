import * as config from 'config'
import RedisStore from 'connect-redis'
import session from 'express-session'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

/**
 * Session store factory aligned with civil-citizen-ui pattern.
 * Uses Redis when session.redis.url or session.useRedisStore is configured,
 * otherwise falls back to MemoryStore for local/dev.
 */
function isRedisEnabled (): boolean {
  if (!config.has('session.useRedisStore')) {
    return false
  }
  const v = config.get<string>('session.useRedisStore')
  return v === true || v === 'true' || v === '1'
}

export function getSessionStore (): session.Store {
  const useRedis = isRedisEnabled()
  const redisUrl = config.has('session.redis.url') && config.get<string>('session.redis.url')

  if ((useRedis || redisUrl) && redisUrl && String(redisUrl).trim().length > 0) {
    try {
      const connectionString = String(redisUrl).startsWith('redis')
        ? redisUrl
        : `redis://${redisUrl}`
      const redisClient = new Redis(connectionString)
      const store = new RedisStore({
        client: redisClient as any,
        prefix: 'cmc-citizen-ui-session:',
        ttl: 86400
      })
      logger.info('Using Redis session store')
      return store as session.Store
    } catch (err) {
      logger.warn('Redis session store failed, using MemoryStore', err)
    }
  }

  if (useRedis && config.has('session.redis.host')) {
    try {
      const protocol = config.has('session.redis.tls') && config.get<boolean>('session.redis.tls')
        ? 'rediss'
        : 'redis'
      const host = config.get<string>('session.redis.host')
      const port = config.get<number>('session.redis.port')
      const key = config.has('session.redis.key') ? config.get<string>('session.redis.key') : ''
      const connectionString = key
        ? `${protocol}://:${key}@${host}:${port}`
        : `${protocol}://${host}:${port}`
      const redisClient = new Redis(connectionString)
      const store = new RedisStore({
        client: redisClient as any,
        prefix: 'cmc-citizen-ui-session:',
        ttl: 86400
      })
      logger.info('Using Redis session store (host/port)')
      return store as session.Store
    } catch (err) {
      logger.warn('Redis session store failed, using MemoryStore', err)
    }
  }

  logger.info('Using Memory session store (no Redis configured)')
  return new session.MemoryStore()
}
